// Internal source of truth for approved public feedback.
// Keep this list empty until the owner has documented permission to publish.
export const approvedFeedback = [];

export const testimonials = approvedFeedback;

export function isApprovedFeedback(entry = {}) {
  return entry.permissionGranted === true && entry.published === true;
}

export function getApprovedFeedback() {
  return approvedFeedback.filter(isApprovedFeedback);
}
