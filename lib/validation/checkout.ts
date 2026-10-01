import { z } from "zod";

export const checkoutCustomerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(7, "Please provide a valid contact phone number"),
  streetAddress: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  additionalInstructions: z.string().max(500).optional(),
  paymentMethod: z.enum(["bank_transfer", "pay_on_delivery", "online_payment"]),
});

export const cartItemPayloadSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  variantId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  customSpecs: z
    .object({
      length_metres: z.number().positive().optional(),
      gauge: z.string().optional(),
      colour: z.string().optional(),
      finish: z.string().optional(),
      bending_angles: z.string().optional(),
      special_instructions: z.string().optional(),
    })
    .optional()
    .nullable(),
});

export const createOrderSchema = z.object({
  customer: checkoutCustomerSchema,
  items: z.array(cartItemPayloadSchema).min(1, "Your cart is empty"),
});

export const fabricationRequestSchema = z.object({
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(7, "Valid phone number required"),
  serviceType: z.string().min(2, "Service type is required"),
  lengthInMetres: z.number().positive().optional(),
  thickness: z.string().optional(),
  material: z.string().optional(),
  projectLocation: z.string().optional(),
  specialInstructions: z.string().max(1000).optional(),
});

export type CheckoutCustomerFormData = z.infer<typeof checkoutCustomerSchema>;
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type FabricationRequestFormData = z.infer<typeof fabricationRequestSchema>;
