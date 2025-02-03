import assert from 'assert';

export function validateName(name: string): void {
  assert(name, 'Name is required');
  assert(name.length >= 2, 'Name must be at least 2 characters long');
  assert(name.length <= 50, 'Name must be less than 50 characters long');
}
