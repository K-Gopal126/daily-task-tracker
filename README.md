# Daily Work Tracker

A modern, responsive daily work tracking application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Task Management**: Add, edit, complete, and delete daily tasks
- **Time Tracking**: Track time spent on each task with easy editing
- **Categories**: Organize tasks by category (Work, Learning, Meetings, Admin, Break)
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Daily Statistics**: View completion rates and time distribution
- **Date Navigation**: Navigate between different dates
- **Local Storage**: All data persists locally in the browser
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Project Structure

```
daily-work-tracker/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx            # Main application page
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx      # Button component with variants
│   │   ├── Input.tsx       # Input component with validation
│   │   └── Select.tsx      # Select dropdown component
│   ├── DailyStats.tsx      # Statistics and analytics view
│   ├── TaskForm.tsx        # Add/edit task modal form
│   ├── TaskItem.tsx        # Individual task display component
│   └── TaskList.tsx        # List of tasks with sorting
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions and constants
│   └── storage.ts          # Local storage management
└── Configuration files...
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Local Storage** - Client-side data persistence

## Key Components

### TaskItem
Individual task display with inline time editing, completion toggle, and priority indicators.

### TaskForm
Modal form for adding new tasks with validation and category/priority selection.

### DailyStats
Comprehensive statistics view showing completion rates, time distribution, and category breakdowns.

### Storage System
Robust local storage management with error handling and data persistence.

## Usage

1. **Add Tasks**: Click "Add Task" to create new tasks with categories and priorities
2. **Track Time**: Click on time values to edit time spent on tasks
3. **Mark Complete**: Click the circle icon to mark tasks as completed
4. **View Stats**: Switch to the "Daily Stats" tab to see productivity insights
5. **Navigate Dates**: Use the date picker to view tasks from different days
6. **Note Your Work**: Check Your Real Strength & Weakness. And Focus How You Can Achieve It.

## See Image

![alt text](https://daily-task-tracker-beta.vercel.app/image.png)

## Customization

The app is highly customizable through the configuration files in the `lib/` directory:

- **Categories**: Modify `CATEGORY_LABELS` and `CATEGORY_COLORS` in `utils.ts`
- **Priorities**: Adjust `PRIORITY_COLORS` for different priority styling
- **Storage**: Extend the storage system in `storage.ts` for different persistence methods

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use and modify for your needs!# daily-task-tracker

