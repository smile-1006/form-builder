import { create } from 'zustand';

export const useFormStore = create((set) => ({
  // Form state
  fields: [],
  currentStep: 0,
  device: 'desktop',
  formId: null,
  
  // Field actions
  addField: (field) => set((state) => ({ 
    fields: [...state.fields, { ...field, id: crypto.randomUUID() }] 
  })),
  
  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  
  removeField: (id) => set((state) => ({
    fields: state.fields.filter(f => f.id !== id)
  })),
  
  reorderFields: (newFields) => set({ fields: newFields }),
  
  // Step actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // Device preview actions
  setDevice: (device) => set({ device }),
  
  // Form actions
  setFormId: (id) => set({ formId: id }),
  
  // Save form to localStorage
  saveForm: () => {
    const state = useFormStore.getState();
    const formData = {
      fields: state.fields,
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
        formId: formData.formId
      });
      return true;
    }
    return false;
  }
})); 