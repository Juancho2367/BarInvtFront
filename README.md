# Bar Inventory Management System

A modern web application for managing bar inventory, sales, clients, and events. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Inventory Management**
  - Track product stock levels
  - Set minimum stock alerts
  - Manage suppliers and categories
  - Track product movements

- **Sales Management**
  - Record sales transactions
  - Support for different payment methods
  - Credit sales tracking
  - Sales history and analytics

- **Client Management**
  - Client profiles and history
  - Credit limits and balances
  - Purchase history
  - Payment tracking

- **Calendar & Events**
  - Event scheduling
  - Event impact on sales
  - Stock predictions for events
  - Event type categorization

- **Reports & Analytics**
  - Sales trends and forecasts
  - Product performance
  - Customer insights
  - Inventory reports

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Chart.js for visualizations
  - React Router for navigation
  - Zustand for state management

- **Backend** (to be implemented)
  - Node.js
  - Express
  - MongoDB
  - Prisma ORM
  - JWT Authentication

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bar-inventory-app.git
   cd bar-inventory-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
front/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── public/            # Public files
└── ...config files
```

## Development

- **Code Style**: Follow the TypeScript and React best practices
- **Component Structure**: Use functional components with hooks
- **State Management**: Use Zustand for global state
- **Styling**: Use Tailwind CSS utility classes
- **Type Safety**: Maintain strict TypeScript types

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
