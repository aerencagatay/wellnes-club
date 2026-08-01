import { camps } from './camps'
import { faq } from './faq'
import { posts } from './posts'
import { teachers } from './teachers'
import { testimonials } from './testimonials'
import { venues } from './venues'
import type { BlogPost, CampSession, FaqItem, Teacher, Testimonial, Venue } from './types'

export * from './types'

const byStartDateAsc = (a: CampSession, b: CampSession) => a.startDate.localeCompare(b.startDate)

export function getAllCamps(): CampSession[] {
  return [...camps].sort(byStartDateAsc)
}

/** `today` çağıran tarafından verilir — seçiciler saat okumaz, test edilebilir kalır. */
export function getUpcomingCamps(today: string, limit?: number): CampSession[] {
  const upcoming = getAllCamps().filter((c) => c.endDate >= today)
  return limit === undefined ? upcoming : upcoming.slice(0, limit)
}

export function getPastCamps(today: string): CampSession[] {
  return getAllCamps()
    .filter((c) => c.endDate < today)
    .reverse()
}

export function getCampBySlug(slug: string): CampSession | undefined {
  return camps.find((c) => c.slug === slug)
}

export function getFeaturedCamps(): CampSession[] {
  return getAllCamps().filter((c) => c.featured)
}

export function getAllTeachers(): Teacher[] {
  return [...teachers]
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return teachers.find((t) => t.slug === slug)
}

export function getTeachersForCamp(camp: CampSession): Teacher[] {
  return camp.teacherSlugs
    .map((slug) => getTeacherBySlug(slug))
    .filter((t): t is Teacher => t !== undefined)
}

export function getCampsForTeacher(teacherSlug: string): CampSession[] {
  return getAllCamps().filter((c) => c.teacherSlugs.includes(teacherSlug))
}

export function getAllVenues(): Venue[] {
  return [...venues]
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug)
}

export function getVenueForCamp(camp: CampSession): Venue {
  const venue = getVenueBySlug(camp.venueSlug)
  if (!venue) {
    throw new Error(
      `İçerik hatası: "${camp.slug}" kampı "${camp.venueSlug}" mekanına işaret ediyor ama venues.ts'te böyle bir kayıt yok.`,
    )
  }
  return venue
}

export function getFaq(): FaqItem[] {
  return [...faq]
}

export function getTestimonials(): Testimonial[] {
  return [...testimonials]
}

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
