# Form Builder

## Introduction
This project is a dynamic Form Builder web application built with modern web technologies. It allows users to create, edit, reorder, and delete form fields interactively. Users can also save forms, preview them on different device sizes, and use prebuilt templates to quickly add common form structures.

## Features
- Add various types of form fields: text input, textarea, dropdown, checkbox, radio group, and date input.
- Edit field properties such as label, placeholder, required status, and options.
- Delete fields from the form.
- Reorder fields using drag-and-drop functionality.
- Save forms and view a list of saved forms.
- Preview forms in different device sizes (mobile, tablet, desktop).
- Use prebuilt templates to quickly add common form layouts.
- Undo and redo changes to the form.
- Responsive and accessible UI with dark mode support.

## Components
- **FormBuilder.jsx**: Main component managing form state, field addition, deletion, editing, and preview.
- **FieldBlock.jsx**: Represents individual form fields with edit and delete controls.
- **FieldSettingsModal.jsx**: Modal dialog for editing field settings.
- **PreviewPane.jsx**: Displays a live preview of the form, responsive to device size.
- **DevicePreviewToggler.jsx**: Allows toggling between device preview modes.
- **ThemeToggler.jsx**: Toggles light/dark theme modes.

## Folder Structure
- `app/components/`: Contains React components used in the application.
- `app/routes/`: Contains route components for different pages.
- `app/state/`: Contains state management hooks and stores.
- `public/`: Static assets like images and icons.
- `README.md`: Project documentation.
- `package.json`: Project dependencies and scripts.
- `vite.config.ts`: Vite build configuration.
- `tailwind.config.js`: Tailwind CSS configuration.

## Technologies Used
- React with Hooks
- Remix framework
- Tailwind CSS for styling
- Headless UI for accessible UI components
- Dnd-kit for drag-and-drop functionality
- Vite for development and build tooling
- PropTypes for runtime type checking

## Installation and Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open the app in your browser at the provided local URL.

## Available Commands
- `npm run dev`: Start the development server with hot module replacement.
- `npm run build`: Build the app for production.
- `npm start`: Run the production build.
- `npm run lint`: Run linting checks.
- `npm run test`: Run tests (if configured).

## Usage
- Use the sidebar to add new fields or prebuilt templates.
- Click on a field to edit its settings.
- Use the drag handle to reorder fields.
- Use the delete button to remove fields.
- Save your form and preview it on different devices.

## Contribution
Contributions are welcome. Please fork the repository and submit pull requests for improvements or bug fixes.

## License
Specify your project license here.
