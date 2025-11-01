import { ValidationError } from './errors'

export const validateEmail = (email: string): void => {
  if (!email) {
    throw new ValidationError('Email is required', 'email')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please enter a valid email address', 'email')
  }
}

export const validatePassword = (password: string): void => {
  if (!password) {
    throw new ValidationError('Password is required', 'password')
  }
  
  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long', 'password')
  }
  
  if (password.length > 128) {
    throw new ValidationError('Password must be less than 128 characters', 'password')
  }
}

export const validatePromptTitle = (title: string): void => {
  if (!title?.trim()) {
    throw new ValidationError('Title is required', 'title')
  }
  
  if (title.trim().length > 200) {
    throw new ValidationError('Title must be less than 200 characters', 'title')
  }
}

export const validatePromptContent = (content: string): void => {
  if (!content?.trim()) {
    throw new ValidationError('Content is required', 'content')
  }
  
  if (content.trim().length > 10000) {
    throw new ValidationError('Content must be less than 10,000 characters', 'content')
  }
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ')
}