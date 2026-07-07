"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FieldRenderer } from "@/components/forms/field-renderer"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import {
  buildDefaultValues,
  buildTemplateZodSchema,
} from "@/modules/templates/domain/field-validation"

interface DynamicFormProps {
  fields: FieldSchema[]
  defaultValues?: Record<string, string>
  onSubmit: (data: Record<string, string>) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function DynamicForm({
  fields,
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Continuar",
}: DynamicFormProps) {
  const schema = buildTemplateZodSchema(fields)
  const form = useForm<Record<string, string>>({
    resolver: zodResolver(schema) as unknown as Resolver<Record<string, string>>,
    defaultValues: { ...buildDefaultValues(fields), ...defaultValues },
    mode: "onBlur",
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((fieldSchema) => (
          <FormField
            key={fieldSchema.key}
            control={form.control}
            name={fieldSchema.key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldSchema.label}
                  {!fieldSchema.required && (
                    <span className="text-muted-foreground font-normal"> (opcional)</span>
                  )}
                </FormLabel>
                <FieldRenderer fieldSchema={fieldSchema} field={field} />
                {fieldSchema.help && (
                  <FormDescription>{fieldSchema.help}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  )
}
