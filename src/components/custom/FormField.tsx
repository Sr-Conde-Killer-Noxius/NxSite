import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";


export interface FormFieldProps<T> {
    form:       T;
    updateForm: (updates: Partial<T>) => void;
    label:      string;
    error?:     string;
}

// Reusable Form Components
export function FormField<T>({ children, label, error }: FormFieldProps<T> & { children: React.ReactNode }){
    return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">{label}</label>
          {children}
          {error && (
            <Alert variant="destructive" className="bg-red-900/50 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
    );
}