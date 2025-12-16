# API Integration Guide

This document explains how to integrate real backend APIs and use Axios in the Mobile Recharge application.

## 🔧 Axios Configuration

### File: `src/api/axiosConfig.js`

The project includes a pre-configured Axios instance with:
- Base URL configuration
- Request/response interceptors
- Error handling
- Authorization token management

### Basic Usage

```javascript
import axiosInstance from './api/axiosConfig';

// Make a GET request
const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/endpoint');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🚀 API Integration Examples

### 1. Configure Base URL

Edit `src/api/axiosConfig.js`:

```javascript
const axiosInstance = axios.create({
  baseURL: 'https://your-api.com/api', // Update this
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Get Recharge Plans from API

Create `src/api/planAPI.js`:

```javascript
import axiosInstance from './axiosConfig';

export const fetchPlans = async (operator) => {
  try {
    const response = await axiosInstance.get(`/plans?operator=${operator}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

export const getPlanById = async (planId) => {
  try {
    const response = await axiosInstance.get(`/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw error;
  }
};
```

### 3. Validate Mobile Number

Create `src/api/validationAPI.js`:

```javascript
import axiosInstance from './axiosConfig';

export const validateMobileNumber = async (mobileNumber, operator) => {
  try {
    const response = await axiosInstance.post('/validate/mobile', {
      mobileNumber,
      operator,
    });
    return response.data;
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};

export const validateOperator = async (operator) => {
  try {
    const response = await axiosInstance.get(`/validate/operator/${operator}`);
    return response.data;
  } catch (error) {
    console.error('Operator validation error:', error);
    throw error;
  }
};
```

### 4. Process Payment

Create `src/api/paymentAPI.js`:

```javascript
import axiosInstance from './axiosConfig';

export const initiatePayment = async (paymentDetails) => {
  try {
    const response = await axiosInstance.post('/payments/initiate', {
      mobileNumber: paymentDetails.mobileNumber,
      operator: paymentDetails.operator,
      planId: paymentDetails.planId,
      amount: paymentDetails.amount,
      paymentMethod: paymentDetails.paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

export const confirmPayment = async (transactionId, paymentData) => {
  try {
    const response = await axiosInstance.post(`/payments/${transactionId}/confirm`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (transactionId) => {
  try {
    const response = await axiosInstance.get(`/payments/${transactionId}/status`);
    return response.data;
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
};
```

### 5. Handle Recharges

Create `src/api/rechargeAPI.js`:

```javascript
import axiosInstance from './axiosConfig';

export const createRecharge = async (rechargeData) => {
  try {
    const response = await axiosInstance.post('/recharges', rechargeData);
    return response.data;
  } catch (error) {
    console.error('Error creating recharge:', error);
    throw error;
  }
};

export const getRechargeHistory = async (mobileNumber) => {
  try {
    const response = await axiosInstance.get(`/recharges/history/${mobileNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getRechargeStatus = async (rechargeId) => {
  try {
    const response = await axiosInstance.get(`/recharges/${rechargeId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
};

export const cancelRecharge = async (rechargeId) => {
  try {
    const response = await axiosInstance.delete(`/recharges/${rechargeId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling recharge:', error);
    throw error;
  }
};
```

## 🔐 Authentication

### Add Authorization Token

Edit `src/api/axiosConfig.js`:

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-api.com/api',
  timeout: 10000,
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## 📱 Using APIs in Components

### Example: Plans Page with API

```javascript
import React, { useState, useEffect } from 'react';
import { fetchPlans } from '../api/planAPI';
import { useRecharge } from '../context/RechargeContext';

function Plans() {
  const { operator } = useRecharge();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const data = await fetchPlans(operator);
        setPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [operator]);

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {plans.map(plan => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export default Plans;
```

### Example: Payment with API

```javascript
import React, { useState } from 'react';
import { initiatePayment } from '../api/paymentAPI';
import { useRecharge } from '../context/RechargeContext';

function Payment() {
  const { mobileNumber, operator, selectedPlan } = useRecharge();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const result = await initiatePayment({
        mobileNumber,
        operator,
        planId: selectedPlan.id,
        amount: selectedPlan.price,
        paymentMethod,
      });

      console.log('Payment initiated:', result);
      // Handle success
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}

export default Payment;
```

## 🧪 Interceptor Examples

### Add Custom Headers

```javascript
axiosInstance.interceptors.request.use((config) => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});
```

### Transform Response Data

```javascript
axiosInstance.interceptors.response.use((response) => {
  // Transform response data
  return {
    ...response,
    data: {
      success: true,
      payload: response.data,
    },
  };
});
```

### Handle Errors Globally

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.log('Too many requests - rate limited');
    }
    if (error.response?.status === 500) {
      console.log('Server error - try again later');
    }
    return Promise.reject(error);
  }
);
```

## 📊 API Endpoints Examples

Here's what your backend API might look like:

```
Base URL: https://api.mobilerecharge.com/api

GET    /plans                    - Get all plans
GET    /plans?operator=Jio       - Get plans by operator
GET    /plans/:id                - Get plan details
POST   /validate/mobile          - Validate mobile number
GET    /operators                - Get available operators
POST   /payments/initiate        - Start payment process
POST   /payments/:id/confirm     - Confirm payment
GET    /payments/:id/status      - Check payment status
POST   /recharges                - Create recharge
GET    /recharges/history/:mobile - Get recharge history
GET    /recharges/:id/status     - Check recharge status
DELETE /recharges/:id            - Cancel recharge
```

## 🔍 Error Handling Best Practices

```javascript
const handleAPICall = async () => {
  try {
    const response = await axiosInstance.get('/endpoint');
    return response.data;
  } catch (error) {
    // Check error type
    if (error.response) {
      // Server responded with error status
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.log('No response received');
    } else {
      // Error in request setup
      console.log('Error:', error.message);
    }
    throw error;
  }
};
```

## 📝 Testing APIs

### Using Thunder Client or Postman

1. **GET Plans**
   - URL: `GET https://api.mobilerecharge.com/api/plans`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

2. **Create Recharge**
   - URL: `POST https://api.mobilerecharge.com/api/recharges`
   - Body: 
   ```json
   {
     "mobileNumber": "9876543210",
     "operator": "Jio",
     "planId": 1,
     "paymentMethod": "upi"
   }
   ```

## 🚀 Production Tips

1. **Use environment variables**:
   ```javascript
   const baseURL = process.env.REACT_APP_API_URL;
   ```

2. **Add request timeout handling**
3. **Implement retry logic**
4. **Cache responses when appropriate**
5. **Log errors for debugging**
6. **Use loading states in UI**
7. **Handle network errors gracefully**

---

**Ready to integrate APIs! 🚀**
