import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { nanoid } from 'nanoid';

const TEMPLATES = {
  contact: {
    name: 'Contact Us',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        step: 1,
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        placeholder: 'Enter your email',
        required: true,
        step: 1,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          message: 'Please enter a valid email address'
        }
      },
      {
        id: 'phone',
        type: 'text',
        label: 'Phone',
        placeholder: 'Enter your phone number',
        step: 2,
        validation: {
          pattern: '^[0-9]{10}$',
          message: 'Please enter a valid 10-digit phone number'
        }
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'How can we help you?',
        required: true,
        step: 2,
        validation: {
          minLength: 10,
          maxLength: 500
        }
      }
    ]
  }
};

const AUTOSAVE_DELAY = 1000; // 1 second

const initialState = {
  fields: [],
  currentStep: 1,
  totalSteps: 1,
  device: 'desktop',
  formId: '',
  theme: 'light',
  history: [],
  currentHistoryIndex: -1,
  responses: {},
  lastSaved: null,
  formTitle: ''
};

export const useFormStore = create(
  devtools((set, get) => ({
    ...initialState,

    // Form title actions
    setFormTitle: (title) => set({ formTitle: title }),

    // Theme actions
    setTheme: (theme) => set({ theme }),

    // History management
    pushToHistory: (fields) => {
      const { history, currentHistoryIndex } = get();
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push([...fields]);
      set({
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1
      });
    },

    undo: () => {
      const { currentHistoryIndex, history } = get();
      if (currentHistoryIndex > 0) {
        set({
          currentHistoryIndex: currentHistoryIndex - 1,
          fields: [...history[currentHistoryIndex - 1]]
        });
      }
    },

    redo: () => {
      const { currentHistoryIndex, history } = get();
      if (currentHistoryIndex < history.length - 1) {
        set({
          currentHistoryIndex: currentHistoryIndex + 1,
          fields: [...history[currentHistoryIndex + 1]]
        });
      }
    },

    // Response management
    addResponse: (formId, response) => {
      const { responses } = get();
      const formResponses = responses[formId] || [];
      const newResponse = {
        id: nanoid(),
        timestamp: new Date().toISOString(),
        data: response
      };
      
      const updatedResponses = {
        ...responses,
        [formId]: [...formResponses, newResponse]
      };
      
      set({ responses: updatedResponses });
      localStorage.setItem('form_responses', JSON.stringify(updatedResponses));
    },

    getResponses: (formId) => {
      const { responses } = get();
      return responses[formId] || [];
    },

    loadResponses: () => {
      const savedResponses = localStorage.getItem('form_responses');
      if (savedResponses) {
        set({ responses: JSON.parse(savedResponses) });
      }
    },

    // Field actions
    addField: (field) => {
      const state = get();
      const newField = { 
        ...field, 
        id: nanoid(),
        step: state.currentStep 
      };
      const newFields = [...state.fields, newField];
      
      set({ 
        fields: newFields,
        totalSteps: Math.max(state.totalSteps, newField.step)
      });
      
      state.pushToHistory(newFields);
      state.autoSave();
    },

    updateField: (id, updates) => {
      const state = get();
      const newFields = state.fields.map(f => f.id === id ? { ...f, ...updates } : f);
      const maxStep = Math.max(...newFields.map(f => f.step));
      
      set({
        fields: newFields,
        totalSteps: maxStep
      });
      
      state.pushToHistory(newFields);
      state.autoSave();
    },

    removeField: (id) => {
      const state = get();
      const newFields = state.fields.filter(f => f.id !== id);
      const maxStep = newFields.length ? Math.max(...newFields.map(f => f.step)) : 1;
      
      set({
        fields: newFields,
        totalSteps: maxStep
      });
      
      state.pushToHistory(newFields);
      state.autoSave();
    },

    reorderFields: (newFields) => {
      const state = get();
      set({ fields: newFields });
      state.pushToHistory(newFields);
      state.autoSave();
    },

    // Auto-save functionality
    autoSave: () => {
      const state = get();
      clearTimeout(state.autoSaveTimeout);
      
      const timeout = setTimeout(() => {
        const formId = state.saveForm();
        set({ lastSaved: new Date().toISOString() });
      }, AUTOSAVE_DELAY);
      
      set({ autoSaveTimeout: timeout });
    },

    // Existing functionality
    setCurrentStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps)
    })),
    prevStep: () => set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1)
    })),
    setDevice: (device) => set({ device }),
    
    loadTemplate: (templateId) => {
      const template = TEMPLATES[templateId];
      if (template) {
        const state = get();
        set({ 
          fields: template.fields,
          currentStep: 1,
          totalSteps: Math.max(...template.fields.map(f => f.step))
        });
        state.pushToHistory(template.fields);
        state.autoSave();
      }
    },
    
    setFormId: (id) => set({ formId: id }),
    
    validateField: (field, value) => {
      if (field.required && !value) {
        return 'This field is required';
      }
      if (field.validation) {
        const { minLength, maxLength, pattern, message } = field.validation;
        if (minLength && value.length < minLength) {
          return `Minimum length is ${minLength} characters`;
        }
        if (maxLength && value.length > maxLength) {
          return `Maximum length is ${maxLength} characters`;
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return message || 'Invalid format';
        }
      }
      return null;
    },
    
    saveForm: () => {
      const state = get();
      const formData = {
        fields: state.fields,
        totalSteps: state.totalSteps,
        formId: state.formId || nanoid()
      };
      localStorage.setItem(`form_${formData.formId}`, JSON.stringify(formData));
      set({ formId: formData.formId });
      return formData.formId;
    },
    
    loadForm: (formId) => {
      const savedForm = localStorage.getItem(`form_${formId}`);
      if (savedForm) {
        const formData = JSON.parse(savedForm);
        const state = get();
        set({ 
          fields: formData.fields,
          formId: formData.formId,
          currentStep: 1,
          totalSteps: formData.totalSteps
        });
        state.pushToHistory(formData.fields);
        return true;
      }
      return false;
    }
  }))
);