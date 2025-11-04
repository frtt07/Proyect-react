import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "date" | "boolean";
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

interface GenericFormProps {
  title: string;
  fields: FormField[];
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const GenericForm: React.FC<GenericFormProps> = ({
  title,
  fields,
  initialValues,
  onSubmit,
  submitLabel = "Guardar",
  onCancel,
}) => {
  const [values, setValues] = React.useState(initialValues);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues({ ...values, [field]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  const renderField = (field: FormField) => {
    if (field.type === "boolean") {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!values[field.name]}
              onChange={handleChange(field.name)}
              color="primary"
            />
          }
          label={field.label}
        />
      );
    }

    return (
      <TextField
        fullWidth
        label={field.label}
        type={field.type || "text"}
        value={values[field.name] || ""}
        onChange={handleChange(field.name)}
        required={field.required}
        variant="outlined"
        multiline={field.multiline}
        rows={field.rows}
      />
    );
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {onCancel && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {submitLabel}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GenericForm;