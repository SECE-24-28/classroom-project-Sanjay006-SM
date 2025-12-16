# Mobile Recharge Web Application

A modern, responsive React application for mobile phone recharges built with React Router and Context API for state management.

## 🚀 Features

- **Modern UI**: Clean, responsive design with blue and white color theme
- **Google Fonts**: Uses Poppins font for a professional look
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **State Management**: Context API for managing user data across pages
- **Multiple Pages**: Home, Mobile Number, Plans, Payment, and Success pages
- **Form Validation**: Mobile number validation and operator selection
- **Dummy Payment**: Simulated payment processing with transaction ID generation
- **LocalStorage**: Optional history tracking of transactions
- **Smooth Animations**: Hover effects and transitions for better UX

## 📁 Project Structure

```
src/
  components/
    Navbar.jsx          # Navigation bar component
    Footer.jsx          # Footer component
    PlanCard.jsx        # Recharge plan card component
    CarsExample.js      # Example component with Axios
  pages/
    Home.jsx            # Home page with Prepaid/Postpaid options
    MobileNumber.jsx    # Mobile number and operator selection
    Plans.jsx           # Display recharge plans
    Payment.jsx         # Payment method selection
    Success.jsx         # Recharge success page
  context/
    RechargeContext.js  # Context API provider and hooks
  styles/
    App.css             # Main app styles
    Navbar.css          # Navbar styles
    Footer.css          # Footer styles
    PlanCard.css        # PlanCard component styles
    Home.css            # Home page styles
    MobileNumber.css    # Mobile number page styles
    Plans.css           # Plans page styles
    Payment.css         # Payment page styles
    Success.css         # Success page styles
  api/
    axiosConfig.js      # Axios configuration and interceptors
    carAPI.js           # API endpoints for car operations
  App.js               # Main App component with routing
  index.js             # React entry point
```

## 🎯 Pages Overview

### 1. Home Page (`/`)
- Welcome banner with application name
- Prepaid and Postpaid options
- Features section highlighting app benefits

### 2. Mobile Number Page (`/recharge`)
- Input field for 10-digit mobile number
- Dropdown to select mobile operator (Jio, Airtel, Vi, BSNL)
- Form validation
- Error messages
- Proceed button to navigate to plans

### 3. Plans Page (`/plans`)
- Display available recharge plans as cards
- Each plan shows: price, validity, data/day, calls, SMS/day
- Select plan functionality
- Highlighted selection with success color
- Proceed to payment button

### 4. Payment Page (`/payment`)
- Order summary showing selected plan details
- Payment method options (UPI, Card, Wallet)
- Dummy payment form fields
- 2-second simulated payment processing
- Transaction ID generation

### 5. Success Page (`/success`)
- Success confirmation message
- Transaction details display
- Copy transaction ID button
- Options to do another recharge or go back home
- Auto-reset of state

## 🛠️ Technologies Used

- **React**: UI library
- **React Router v6**: Client-side routing
- **Context API**: State management
- **CSS3**: Styling with gradients, animations, and responsive design
- **Poppins Font**: Google Fonts for professional typography
- **Axios**: HTTP client (included for API calls)

## 📦 Installation

1. **Clone or navigate to the project**
   ```bash
   cd car_pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`

## 🎨 Styling Features

- **Color Scheme**:
  - Primary: `#0066cc` (Blue)
  - Secondary: `#003d99` (Dark Blue)
  - Accent: `#00b4d8` (Light Blue)
  - Success: `#28a745` (Green)
  - Error: `#dc3545` (Red)

- **Responsive Breakpoints**:
  - Desktop: Full layout
  - Tablet (≤768px): Adjusted spacing and grid
  - Mobile (≤480px): Single column layout

- **Hover Animations**:
  - Cards lift up on hover
  - Smooth color transitions
  - Button scale effects

## 📱 Responsive Grid

- **Plans Grid**: Auto-fill with minimum 280px cards
- **Features Grid**: Responsive columns based on available space
- **Payment Methods**: 3-column grid on desktop, single column on mobile

## 🔐 Context API Structure

### RechargeContext provides:
- `mobileNumber`: User's phone number
- `operator`: Selected mobile operator
- `selectedPlan`: Chosen recharge plan
- `transactionId`: Generated transaction ID
- `history`: Array of past transactions

### Available Functions:
- `updateMobileNumber(number)`: Save mobile number
- `updateOperator(operator)`: Save operator
- `selectPlan(plan)`: Select a recharge plan
- `generateTransactionId()`: Create transaction ID
- `resetData()`: Clear all data

## 📊 Sample Recharge Plans

The app includes 6 sample plans:
1. **₹99** - 28 days, 2GB/day
2. **₹199** - 28 days, 1.5GB/day
3. **₹299** - 28 days, 3GB/day (Most Popular)
4. **₹399** - 28 days, 5GB/day
5. **₹499** - 56 days, 3GB/day
6. **₹599** - 84 days, 2GB/day

## 💾 LocalStorage Integration

Transactions are automatically saved to LocalStorage:
```javascript
localStorage.getItem('rechargeHistory') // Retrieve history
localStorage.setItem('rechargeHistory', JSON.stringify(data)) // Save history
```

## 🔄 User Flow

```
Home → Select Prepaid/Postpaid
  ↓
Mobile Number → Enter number & select operator
  ↓
Plans → Choose a recharge plan
  ↓
Payment → Select payment method
  ↓
Success → Confirm recharge & view transaction ID
```

## 🎯 Form Validation

- **Mobile Number**: Must be exactly 10 digits
- **Operator**: Must be selected from dropdown
- **Payment Method**: Must be selected before payment
- **Error Messages**: Clear, user-friendly error displays

## 🚀 Future Enhancements

- Real payment gateway integration
- User authentication and login
- Transaction history page
- SMS notifications
- Multiple language support
- Dark mode theme
- Payment status tracking
- Refund management

## 📝 Component Examples

### Using Context API
```javascript
import { useRecharge } from '../context/RechargeContext';

function MyComponent() {
  const { mobileNumber, updateMobileNumber } = useRecharge();
  
  return (
    <div>
      {mobileNumber}
      <button onClick={() => updateMobileNumber('9876543210')}>
        Update Number
      </button>
    </div>
  );
}
```

### Plan Card Component
```javascript
<PlanCard 
  plan={{price: 299, validity: 28, dataPerDay: '3GB'}} 
  onSelect={handleSelectPlan} 
/>
```

## 🐛 Troubleshooting

1. **Port 3000 already in use**
   ```bash
   npm start -- --port 3001
   ```

2. **Missing styles**
   - Ensure all CSS files are in `src/styles/` directory
   - Check CSS file imports in component files

3. **Routing issues**
   - Verify `<BrowserRouter>` wraps the app
   - Check `<Routes>` and `<Route>` configuration

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created with React and modern web technologies.

---

**Happy Recharging! 📱**
