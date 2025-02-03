import type { Level as LevelType } from '@/types';
import assert from 'assert';

export function validateDescription(description: string) {
  assert(description?.trim().length > 0, 'Description is required');
  assert(description.length <= 1000, 'Description must be less than 1000 characters');
}

export function validateNumber(number: number) {
  assert(number >= 0, 'Level number must be positive');
}

export async function validateAnswer(level: LevelType, answer: string): Promise<boolean> {
  assert(answer.trim(), 'Answer cannot be empty');

  if (level.requiredElements?.length) {
    for (const element of level.requiredElements) {
      assert(
        answer.toLowerCase().includes(element.toLowerCase()),
        `Answer must contain the word "${element}"`
      );
    }
  }

  return true;
}
