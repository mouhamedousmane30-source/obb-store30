# OBB Store Admin Dashboard

A premium, modern admin dashboard for the luxury streetwear brand "OBB STORE", built with React, TypeScript, and Tailwind CSS.

## 🎨 Design Identity

The admin dashboard maintains the same visual identity as the main website:

- **Primary Colors**: Black (#000000), White (#FFFFFF)
- **Secondary Color**: Light Grey (#F5F5F5)
- **Accent Color**: Metallic Silver (#C0C0C0)
- **Aesthetic**: Minimalist luxury, inspired by Apple, Nike, Zara, and Shopify Plus
- **Layout**: Clean typography with large spacing and soft shadows
- **Responsive**: Fully responsive for desktop, tablet, and mobile
- **Modes**: Dark mode (primary), Light mode (secondary)

## 📁 Project Structure

```
src/
├── routes/
│   └── admin/
│       ├── index.tsx              # Dashboard Home
│       ├── orders.tsx             # Orders Management
│       ├── products.tsx           # Products Management
│       ├── categories.tsx         # Product Categories
│       ├── inventory.tsx          # Inventory Management
│       ├── customers.tsx          # Customer Management
│       ├── analytics.tsx          # Analytics & Reports
│       ├── coupons.tsx            # Coupons & Promotions
│       ├── payments.tsx           # Payment Transactions
│       ├── shipping.tsx           # Shipping Methods
│       ├── reviews.tsx            # Customer Reviews
│       ├── marketing.tsx          # Marketing Campaigns
│       ├── notifications.tsx      # Admin Notifications
│       ├── staff.tsx              # Staff Management
│       └── settings.tsx           # Store Settings
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx       # Collapsible Sidebar Navigation
│       ├── AdminLayout.tsx        # Main Admin Layout
│       ├── AdminTopNav.tsx        # Top Navigation Bar
│       ├── KPICard.tsx            # Key Performance Indicator Cards
│       ├── Charts.tsx             # Charts (Recharts)
│       ├── DataTable.tsx          # Reusable Data Table
│       ├── StatusBadge.tsx        # Status Badge Component
│       └── ... other components
└── styles/
    └── admin.css                  # Admin-specific styles
```

## 🎯 Key Features

### Dashboard Home
- **KPI Cards**: Revenue, Orders, Customers, Products, Growth metrics
- **Charts**: Revenue trends, Sales performance, Order trends
- **Recent Data**: Latest orders, best-selling products, customer activity
- **Real-time Metrics**: Live dashboard updates

### Orders Management
- Complete order listing with advanced filters
- Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
- Actions: View, Edit, Print Invoice, Update Status, Refund, Delete
- Payment & Delivery status tracking

### Product Management
- Grid and Table view options
- Product CRUD operations
- Bulk actions: Add, Edit, Duplicate, Delete, Archive
- Product form with images, pricing, stock, sizes, colors, SEO

### Inventory Management
- Real-time stock tracking
- Low stock alerts
- Reserve stock management
- Inventory movement history

### Customer Management
- Customer profiles with complete information
- Loyalty levels (Platinum, Gold, Silver)
- Order history and spending analysis
- Export customer data

### Analytics
- Revenue analytics with trends
- Sales performance metrics
- Customer growth tracking
- Conversion rate analysis
- Interactive charts

### Coupons & Promotions
- Create and manage discount codes
- Track coupon performance
- Set discount rules (percentage, fixed, free shipping)
- Usage limits and expiry dates

### Additional Pages
- **Payments**: Transaction history and payment method management
- **Shipping**: Configure shipping methods and carriers
- **Reviews**: Moderate customer reviews and ratings
- **Marketing**: Email campaigns, promotions, social media integration
- **Notifications**: Admin alerts for orders, stock, refunds
- **Staff**: User management and permissions
- **Settings**: Store configuration, payment methods, email templates

## 🎨 Component Library

### Reusable Components

#### KPICard
Displays key performance indicators with trending data.

```tsx
<KPICard
  title="Total Revenue"
  value="$125,430"
  change={12.5}
  icon={<DollarSign size={24} />}
  color="silver"
/>
```

#### Charts
Built with Recharts for beautiful data visualization.

```tsx
<RevenueChart title="Revenue Trend" height={400} />
<OrdersChart title="Orders Overview" height={400} />
```

#### DataTable
Generic, reusable table component with custom columns.

```tsx
<DataTable
  title="Recent Orders"
  columns={[
    { key: 'orderNumber', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    // ... more columns
  ]}
  data={ordersData}
/>
```

#### StatusBadge
Display status with color-coded badges.

```tsx
<StatusBadge status="delivered">Delivered</StatusBadge>
```

## 🛠 Technology Stack

- **Frontend Framework**: React 19
- **Type Safety**: TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS + Custom CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI (+ Custom)
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **State Management**: React Query

## 📱 Responsive Design

The admin dashboard is fully responsive:

- **Desktop**: Full sidebar and multi-column layouts
- **Tablet**: Collapsible sidebar, optimized spacing
- **Mobile**: Stack all elements vertically, collapsible navigation

## ⌨️ Navigation

The sidebar provides quick access to all admin features:

- **Dashboard**: Overview of key metrics
- **Orders**: Manage customer orders
- **Products**: Product catalog management
- **Categories**: Organize products
- **Inventory**: Track stock levels
- **Customers**: Customer database
- **Analytics**: Business intelligence
- **Coupons**: Discount management
- **Payments**: Payment processing
- **Shipping**: Logistics configuration
- **Reviews**: Customer feedback
- **Marketing**: Promotional campaigns
- **Notifications**: Alert center
- **Staff**: Team management
- **Settings**: Configuration

## 🎨 Color Scheme

- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Background**: Charcoal Gray (#111111, #1a1a1a, #262626)
- **Accent**: Metallic Silver (#c0c0c0, #d4d4d8)
- **Success**: Emerald Green (#10b981)
- **Warning**: Amber Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

## 🚀 Getting Started

1. Navigate to `/admin` to access the dashboard
2. The sidebar provides navigation to all features
3. Use the top navigation for search and settings
4. KPI cards display key metrics at a glance
5. Tables support filtering, sorting, and bulk actions

## 📦 Performance

- Optimized images and assets
- Lazy loading for charts and large tables
- Efficient state management with React Query
- Code splitting for faster page loads
- Responsive design for all screen sizes

## 🔒 Security Features

- Two-factor authentication support
- IP whitelist configuration
- Role-based access control (RBAC)
- Secure payment method storage
- Email verification for sensitive actions

## 🎯 Future Enhancements

- [ ] Real-time data updates with WebSocket
- [ ] Advanced reporting with export functionality
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Custom dashboard widgets
- [ ] Bulk import/export capabilities
- [ ] Advanced inventory forecasting
- [ ] Customer segmentation tools
- [ ] A/B testing framework
- [ ] Performance monitoring dashboard

## 📝 License

All rights reserved © OBB Store 2024

## 👨‍💼 Support

For admin dashboard support, contact: admin@obbstore.com
