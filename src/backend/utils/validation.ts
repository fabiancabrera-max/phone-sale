import {
  CreateProductInput,
  UpdateProductInput,
  ProductCondition,
  ProductStatus,
} from '@/backend/types';
import {
  PRODUCT_VALIDATION,
  MAX_IMAGES_PER_PRODUCT,
  ERROR_CODES,
} from '@/backend/config/constants';

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public code: string = ERROR_CODES.INVALID_INPUT,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

const VALID_CONDITIONS: ProductCondition[] = [
  'new',
  'used_as_new',
  'used',
  'refurbished',
];

/**
 * Validate product creation input
 */
export function validateCreateProduct(input: unknown): CreateProductInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Invalid input: expected object');
  }

  const data = input as Record<string, any>;

  // Validate title
  if (typeof data.title !== 'string') {
    throw new ValidationError(
      'Title is required and must be a string',
      ERROR_CODES.INVALID_INPUT,
      'title'
    );
  }
  if (data.title.length < PRODUCT_VALIDATION.MIN_TITLE_LENGTH) {
    throw new ValidationError(
      `Title must be at least ${PRODUCT_VALIDATION.MIN_TITLE_LENGTH} characters`,
      ERROR_CODES.INVALID_INPUT,
      'title'
    );
  }
  if (data.title.length > PRODUCT_VALIDATION.MAX_TITLE_LENGTH) {
    throw new ValidationError(
      `Title must not exceed ${PRODUCT_VALIDATION.MAX_TITLE_LENGTH} characters`,
      ERROR_CODES.INVALID_INPUT,
      'title'
    );
  }

  // Validate description
  if (typeof data.description !== 'string') {
    throw new ValidationError(
      'Description is required and must be a string',
      ERROR_CODES.INVALID_INPUT,
      'description'
    );
  }
  if (data.description.length < PRODUCT_VALIDATION.MIN_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `Description must be at least ${PRODUCT_VALIDATION.MIN_DESCRIPTION_LENGTH} characters`,
      ERROR_CODES.INVALID_INPUT,
      'description'
    );
  }
  if (data.description.length > PRODUCT_VALIDATION.MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError(
      `Description must not exceed ${PRODUCT_VALIDATION.MAX_DESCRIPTION_LENGTH} characters`,
      ERROR_CODES.INVALID_INPUT,
      'description'
    );
  }

  // Validate price
  if (typeof data.price !== 'number') {
    throw new ValidationError(
      'Price is required and must be a number',
      ERROR_CODES.INVALID_INPUT,
      'price'
    );
  }
  if (data.price < PRODUCT_VALIDATION.MIN_PRICE) {
    throw new ValidationError(
      `Price must be at least ${PRODUCT_VALIDATION.MIN_PRICE}`,
      ERROR_CODES.INVALID_INPUT,
      'price'
    );
  }
  if (data.price > PRODUCT_VALIDATION.MAX_PRICE) {
    throw new ValidationError(
      `Price must not exceed ${PRODUCT_VALIDATION.MAX_PRICE}`,
      ERROR_CODES.INVALID_INPUT,
      'price'
    );
  }

  // Validate specs
  if (!data.specs || typeof data.specs !== 'object') {
    throw new ValidationError(
      'Specs object is required',
      ERROR_CODES.INVALID_INPUT,
      'specs'
    );
  }

  // Validate specs.condition
  if (
    typeof data.specs.condition !== 'string' ||
    !VALID_CONDITIONS.includes(data.specs.condition)
  ) {
    throw new ValidationError(
      `Condition must be one of: ${VALID_CONDITIONS.join(', ')}`,
      ERROR_CODES.INVALID_INPUT,
      'specs.condition'
    );
  }

  // Validate specs.color
  if (
    typeof data.specs.color !== 'string' ||
    data.specs.color.trim().length === 0
  ) {
    throw new ValidationError(
      'Color is required and must be a non-empty string',
      ERROR_CODES.INVALID_INPUT,
      'specs.color'
    );
  }

  // Validate specs.storage
  if (
    typeof data.specs.storage !== 'string' ||
    data.specs.storage.trim().length === 0
  ) {
    throw new ValidationError(
      'Storage is required and must be a non-empty string',
      ERROR_CODES.INVALID_INPUT,
      'specs.storage'
    );
  }

  // Validate images
  if (!Array.isArray(data.images)) {
    throw new ValidationError(
      'Images must be an array',
      ERROR_CODES.INVALID_INPUT,
      'images'
    );
  }
  if (data.images.length === 0) {
    throw new ValidationError(
      'At least one image is required',
      ERROR_CODES.INVALID_INPUT,
      'images'
    );
  }
  if (data.images.length > MAX_IMAGES_PER_PRODUCT) {
    throw new ValidationError(
      `Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed per product`,
      ERROR_CODES.INVALID_INPUT,
      'images'
    );
  }
  if (
    !data.images.every(
      (img: any) => typeof img === 'string' && img.startsWith('http')
    )
  ) {
    throw new ValidationError(
      'All images must be valid URLs',
      ERROR_CODES.INVALID_INPUT,
      'images'
    );
  }

  // Validate status (optional)
  const validStatuses: ProductStatus[] = ['featured', 'on_sale', 'sold'];
  if (data.status !== undefined) {
    if (
      typeof data.status !== 'string' ||
      !validStatuses.includes(data.status as ProductStatus)
    ) {
      throw new ValidationError(
        `Status must be one of: ${validStatuses.join(', ')}`,
        ERROR_CODES.INVALID_INPUT,
        'status'
      );
    }
  }

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    price: data.price,
    specs: {
      condition: data.specs.condition,
      color: data.specs.color.trim(),
      storage: data.specs.storage.trim(),
    },
    images: data.images as string[],
    status: (data.status as ProductStatus) || 'on_sale',
  };
}

/**
 * Validate product update input
 */
export function validateUpdateProduct(input: unknown): UpdateProductInput {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Invalid input: expected object');
  }

  const data = input as Record<string, any>;
  const update: UpdateProductInput = {};

  // Validate title (optional)
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      throw new ValidationError(
        'Title must be a string',
        ERROR_CODES.INVALID_INPUT,
        'title'
      );
    }
    if (data.title.length < PRODUCT_VALIDATION.MIN_TITLE_LENGTH) {
      throw new ValidationError(
        `Title must be at least ${PRODUCT_VALIDATION.MIN_TITLE_LENGTH} characters`,
        ERROR_CODES.INVALID_INPUT,
        'title'
      );
    }
    if (data.title.length > PRODUCT_VALIDATION.MAX_TITLE_LENGTH) {
      throw new ValidationError(
        `Title must not exceed ${PRODUCT_VALIDATION.MAX_TITLE_LENGTH} characters`,
        ERROR_CODES.INVALID_INPUT,
        'title'
      );
    }
    update.title = data.title.trim();
  }

  // Validate description (optional)
  if (data.description !== undefined) {
    if (typeof data.description !== 'string') {
      throw new ValidationError(
        'Description must be a string',
        ERROR_CODES.INVALID_INPUT,
        'description'
      );
    }
    if (data.description.length < PRODUCT_VALIDATION.MIN_DESCRIPTION_LENGTH) {
      throw new ValidationError(
        `Description must be at least ${PRODUCT_VALIDATION.MIN_DESCRIPTION_LENGTH} characters`,
        ERROR_CODES.INVALID_INPUT,
        'description'
      );
    }
    if (data.description.length > PRODUCT_VALIDATION.MAX_DESCRIPTION_LENGTH) {
      throw new ValidationError(
        `Description must not exceed ${PRODUCT_VALIDATION.MAX_DESCRIPTION_LENGTH} characters`,
        ERROR_CODES.INVALID_INPUT,
        'description'
      );
    }
    update.description = data.description.trim();
  }

  // Validate price (optional)
  if (data.price !== undefined) {
    if (typeof data.price !== 'number') {
      throw new ValidationError(
        'Price must be a number',
        ERROR_CODES.INVALID_INPUT,
        'price'
      );
    }
    if (
      data.price < PRODUCT_VALIDATION.MIN_PRICE ||
      data.price > PRODUCT_VALIDATION.MAX_PRICE
    ) {
      throw new ValidationError(
        `Price must be between ${PRODUCT_VALIDATION.MIN_PRICE} and ${PRODUCT_VALIDATION.MAX_PRICE}`,
        ERROR_CODES.INVALID_INPUT,
        'price'
      );
    }
    update.price = data.price;
  }

  // Validate specs (optional & partial)
  if (data.specs !== undefined) {
    if (typeof data.specs !== 'object') {
      throw new ValidationError(
        'Specs must be an object',
        ERROR_CODES.INVALID_INPUT,
        'specs'
      );
    }

    update.specs = {};

    // Validate condition
    if (data.specs.condition !== undefined) {
      if (
        typeof data.specs.condition !== 'string' ||
        !VALID_CONDITIONS.includes(data.specs.condition)
      ) {
        throw new ValidationError(
          `Condition must be one of: ${VALID_CONDITIONS.join(', ')}`,
          ERROR_CODES.INVALID_INPUT,
          'specs.condition'
        );
      }
      update.specs.condition = data.specs.condition;
    }

    // Validate color
    if (data.specs.color !== undefined) {
      if (
        typeof data.specs.color !== 'string' ||
        data.specs.color.trim().length === 0
      ) {
        throw new ValidationError(
          'Color must be a non-empty string',
          ERROR_CODES.INVALID_INPUT,
          'specs.color'
        );
      }
      update.specs.color = data.specs.color.trim();
    }

    // Validate storage
    if (data.specs.storage !== undefined) {
      if (
        typeof data.specs.storage !== 'string' ||
        data.specs.storage.trim().length === 0
      ) {
        throw new ValidationError(
          'Storage must be a non-empty string',
          ERROR_CODES.INVALID_INPUT,
          'specs.storage'
        );
      }
      update.specs.storage = data.specs.storage.trim();
    }
  }

  // Validate images (optional)
  if (data.images !== undefined) {
    if (!Array.isArray(data.images)) {
      throw new ValidationError(
        'Images must be an array',
        ERROR_CODES.INVALID_INPUT,
        'images'
      );
    }
    if (data.images.length > MAX_IMAGES_PER_PRODUCT) {
      throw new ValidationError(
        `Maximum ${MAX_IMAGES_PER_PRODUCT} images allowed per product`,
        ERROR_CODES.INVALID_INPUT,
        'images'
      );
    }
    if (
      !data.images.every(
        (img: any) => typeof img === 'string' && img.startsWith('http')
      )
    ) {
      throw new ValidationError(
        'All images must be valid URLs',
        ERROR_CODES.INVALID_INPUT,
        'images'
      );
    }
    update.images = data.images as string[];
  }

  // Validate status (optional)
  if (data.status !== undefined) {
    const validStatuses: ProductStatus[] = ['featured', 'on_sale', 'sold'];
    if (
      typeof data.status !== 'string' ||
      !validStatuses.includes(data.status as ProductStatus)
    ) {
      throw new ValidationError(
        `Status must be one of: ${validStatuses.join(', ')}`,
        ERROR_CODES.INVALID_INPUT,
        'status'
      );
    }
    update.status = data.status as ProductStatus;
  }

  // Ensure at least one field is being updated
  if (Object.keys(update).length === 0) {
    throw new ValidationError('At least one field must be provided for update');
  }

  return update;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
