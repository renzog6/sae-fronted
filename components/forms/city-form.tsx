// filepath: sae-frontend/components/forms/city-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CitySchema, CityFormData } from "@/lib/validations/location";
import { useProvinces } from "@/lib/hooks/useLocations";

interface CityFormProps {
  accessToken: string;
  onSubmit: (data: CityFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CityFormData>;
  isEdit?: boolean;
  onCancel?: () => void;
  error?: string | null;
}

export function CityForm({
  accessToken,
  onSubmit,
  isLoading = false,
  defaultValues,
  isEdit = false,
  onCancel,
  error,
}: CityFormProps) {
  const { data: provinces, isLoading: provLoading, error: provError } = useProvinces(accessToken);

  const form = useForm<CityFormData>({
    resolver: zodResolver(CitySchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Buenos Aires" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código postal</FormLabel>
              <FormControl>
                <Input placeholder="Ej. C1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provinceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ? String(field.value) : undefined}
                disabled={provLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={provLoading ? "Cargando..." : "Selecciona una provincia"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces?.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {provError && (
                <FormDescription className="text-red-600">Error al cargar provincias</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isLoading ? (isEdit ? "Guardando..." : "Creando...") : isEdit ? "Guardar cambios" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

