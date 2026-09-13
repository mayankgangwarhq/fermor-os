import mongoose from 'mongoose';

/**
 * Builds a query object that safely checks _id only if the provided string is a valid 24-hex ObjectId,
 * preventing Mongoose CastError exceptions when querying with custom string IDs.
 *
 * @param id The ID to search for (e.g. 'farm-1', 'CASE-1001', or '507f1f77bcf86cd799439011')
 * @param additionalFields Optional extra fields to search for (e.g. ['id', 'farmerId', 'userId'])
 */
export const buildIdQuery = (id: string, additionalFields: string[] = ['id']): any => {
  if (!id) return { _id: null };

  const conditions: any[] = [];

  // Check additional string fields like `id`, `farmerId`, `caseId`, etc.
  for (const field of additionalFields) {
    conditions.push({ [field]: id });
  }

  // Only query _id if valid ObjectId hex string
  if (mongoose.isValidObjectId(id)) {
    conditions.push({ _id: id });
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { $or: conditions };
};

/**
 * Checks if a string is a valid MongoDB ObjectId.
 */
export const isValidObjectId = (id: string): boolean => {
  return mongoose.isValidObjectId(id);
};
