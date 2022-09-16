export function resizeTwitterProfileImage(profile_image_url: string | undefined): string {
  if (!profile_image_url) return '';

  return profile_image_url?.replace('_normal', '');
}
