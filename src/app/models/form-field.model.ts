export type FieldType = 'text' | 'date-range' | 'select';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  order: number;
}
