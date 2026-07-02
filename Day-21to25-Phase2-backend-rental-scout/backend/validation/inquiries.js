export function validateInquiry({ rental, name, email, moveInDate, message }) {
  const errors = {}

  if (!rental) {
    errors.rentalId = 'Choose a valid rental.'
  }

  if (!name || name.trim().length < 2) {
    errors.name = 'Enter your name.'
  }

  if (!email || !email.includes('@')) {
    errors.email = 'Enter a valid email.'
  }

  if (!moveInDate) {
    errors.moveInDate = 'Choose a move-in date.'
  }

  if (!message || message.trim().length < 10) {
    errors.message = 'Write at least 10 characters.'
  }

  return errors
}
