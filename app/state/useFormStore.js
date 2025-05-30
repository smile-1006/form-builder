import { create } from 'zustand';

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

export const useFormStore = create((set, get) => ({
  // Form state
  fields: [],
  currentStep: 1,
  totalSteps: 1,
  device: 'desktop',
  formId: null,
  
  // Field actions
  addField: (field) => set((state) => {
    const newField = { 
      ...field, 
      id: crypto.randomUUID(),
      step: state.currentStep 
    };
    return { 
      fields: [...state.fields, newField],
      totalSteps: Math.max(state.totalSteps, newField.step)
    };
  }),
  
  updateField: (id, updates) => set((state) => {
    const newFields = state.fields.map(f => f.id === id ? { ...f, ...updates } : f);
    const maxStep = Math.max(...newFields.map(f => f.step));
    return {
      fields: newFields,
      totalSteps: maxStep
    };
  }),
  
  removeField: (id) => set((state) => {
    const newFields = state.fields.filter(f => f.id !== id);
    const maxStep = newFields.length ? Math.max(...newFields.map(f => f.step)) : 1;
    return {
      fields: newFields,
      totalSteps: maxStep
    };
  }),
  
  reorderFields: (newFields) => set({ fields: newFields }),
  
  // Step actions
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.totalSteps)
  })),
  prevStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 1)
  })),
  
  // Device preview actions
  setDevice: (device) => set({ device }),
  
  // Template actions
  loadTemplate: (templateId) => {
    const template = TEMPLATES[templateId];
    if (template) {
      set({ 
        fields: template.fields,
        currentStep: 1,
        totalSteps: Math.max(...template.fields.map(f => f.step))
      });
    }
  },
  
  // Form actions
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
  
  // Save form to localStorage
  saveForm: () => {
    const state = get();
    const formData = {
      fields: state.fields,
      totalSteps: state.totalSteps,
      formId: state.formId || crypto.randomUUID()
    };
    localStorage.setItem(`form_${formData.formId}`, JSON.stringify(formData));
    set({ formId: formData.formId });
    return formData.formId;
  },
  
  // Load form from localStorage
  loadForm: (formId) => {
    const savedForm = localStorage.getItem(`form_${formId}`);
    if (savedForm) {
      const formData = JSON.parse(savedForm);
      set({ 
        fields: formData.fields,
        formId: formData.formId,
        currentStep: 1,
        totalSteps: formData.totalSteps
      });
      return true;
    }
    return false;
  }
}));