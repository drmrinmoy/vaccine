import { Child, Vaccine, VaccineSchedule } from '@/types';

// Calculate child's age in months
export function calculateAgeInMonths(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  const yearDiff = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  return yearDiff * 12 + monthDiff;
}

// Calculate child's age in years
export function calculateAgeInYears(dateOfBirth: string): number {
  return calculateAgeInMonths(dateOfBirth) / 12;
}

// Format age for display
export function formatAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  
  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
}

// Helper function to determine if a vaccine is due based on age range
function isInAgeRange(ageInMonths: number, ageRange: string): boolean {
  if (ageRange === 'At birth') {
    return ageInMonths >= 0;
  }
  
  if (ageRange.includes('weeks')) {
    const weeks = parseInt(ageRange.split(' ')[0]);
    const monthEquivalent = weeks / 4.33; // Approximate weeks to months
    return ageInMonths >= monthEquivalent;
  }
  
  if (ageRange.includes('months')) {
    const months = parseInt(ageRange.split(' ')[0]);
    return ageInMonths >= months;
  }
  
  if (ageRange.includes('-')) {
    const [start, end] = ageRange.split('-');
    
    let startMonths = 0;
    if (start.includes('months')) {
      startMonths = parseInt(start);
    } else if (start.includes('years') || !start.includes(' ')) {
      // If just a number or explicitly years
      startMonths = parseInt(start) * 12;
    }
    
    let endMonths = Infinity;
    if (end.includes('months')) {
      endMonths = parseInt(end);
    } else if (end.includes('years') || !end.includes(' ')) {
      // If just a number or explicitly years
      endMonths = parseInt(end) * 12;
    }
    
    return ageInMonths >= startMonths && ageInMonths <= endMonths;
  }
  
  if (ageRange.includes('years')) {
    const years = parseInt(ageRange);
    return ageInMonths >= years * 12;
  }
  
  return false;
}

// Get vaccine recommendations for a child
export function getVaccineRecommendations(
  child: Child,
  vaccines: Vaccine[],
  vaccineSchedule: VaccineSchedule
): {
  vaccine: Vaccine;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  dueDate?: string;
}[] {
  const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
  const recommendations: {
    vaccine: Vaccine;
    status: 'completed' | 'due' | 'overdue' | 'upcoming';
    dueDate?: string;
  }[] = [];
  
  // Get all administered vaccines
  const administeredVaccines = new Map<string, number>();
  child.vaccineHistory.forEach(dose => {
    const count = administeredVaccines.get(dose.vaccineId) || 0;
    administeredVaccines.set(dose.vaccineId, count + 1);
  });
  
  // Check each vaccine in the schedule
  vaccineSchedule.recommendedVaccines.forEach(scheduleItem => {
    const isCurrentAgeRange = isInAgeRange(ageInMonths, scheduleItem.ageRange);
    const isPastAgeRange = ageInMonths > getMaxAgeInMonths(scheduleItem.ageRange);
    
    scheduleItem.vaccines.forEach(vaccineId => {
      const vaccine = vaccines.find(v => v.id === vaccineId);
      if (!vaccine) return;
      
      const administeredDoses = administeredVaccines.get(vaccineId) || 0;
      const isCompleted = administeredDoses >= vaccine.doseCount;
      
      if (isCompleted) {
        // If all doses are completed, add to recommendations as completed
        recommendations.push({
          vaccine,
          status: 'completed'
        });
      } else if (isCurrentAgeRange) {
        // If in current age range and not completed, add as due
        recommendations.push({
          vaccine,
          status: 'due',
          dueDate: new Date().toISOString() // Due now
        });
      } else if (isPastAgeRange) {
        // If past age range and not completed, add as overdue
        recommendations.push({
          vaccine,
          status: 'overdue',
          dueDate: getEstimatedDueDate(child.dateOfBirth, scheduleItem.ageRange)
        });
      } else {
        // If not yet in age range, add as upcoming
        recommendations.push({
          vaccine,
          status: 'upcoming',
          dueDate: getEstimatedDueDate(child.dateOfBirth, scheduleItem.ageRange)
        });
      }
    });
  });
  
  // Remove duplicates, keeping the most urgent status
  const uniqueRecommendations = new Map<string, typeof recommendations[0]>();
  recommendations.forEach(rec => {
    const existing = uniqueRecommendations.get(rec.vaccine.id);
    if (!existing || getPriorityOrder(rec.status) > getPriorityOrder(existing.status)) {
      uniqueRecommendations.set(rec.vaccine.id, rec);
    }
  });
  
  return Array.from(uniqueRecommendations.values());
}

// Helper function to get priority order of status
function getPriorityOrder(status: 'completed' | 'due' | 'overdue' | 'upcoming'): number {
  switch (status) {
    case 'overdue': return 4;
    case 'due': return 3;
    case 'upcoming': return 2;
    case 'completed': return 1;
    default: return 0;
  }
}

// Helper function to get maximum age in months from an age range
function getMaxAgeInMonths(ageRange: string): number {
  if (ageRange === 'At birth') {
    return 1; // 1 month
  }
  
  if (ageRange.includes('weeks')) {
    const weeks = parseInt(ageRange.split(' ')[0]);
    return weeks / 4.33; // Approximate weeks to months
  }
  
  if (ageRange.includes('-')) {
    const end = ageRange.split('-')[1].trim();
    
    if (end.includes('months')) {
      return parseInt(end);
    }
    
    if (end.includes('years') || !end.includes(' ')) {
      return parseInt(end) * 12;
    }
  }
  
  if (ageRange.includes('months')) {
    return parseInt(ageRange.split(' ')[0]);
  }
  
  if (ageRange.includes('years')) {
    return parseInt(ageRange) * 12;
  }
  
  return 0;
}

// Helper function to estimate due date based on birth date and age range
function getEstimatedDueDate(dateOfBirth: string, ageRange: string): string {
  const birthDate = new Date(dateOfBirth);
  
  if (ageRange === 'At birth') {
    return birthDate.toISOString();
  }
  
  if (ageRange.includes('weeks')) {
    const weeks = parseInt(ageRange.split(' ')[0]);
    const dueDate = new Date(birthDate);
    dueDate.setDate(dueDate.getDate() + weeks * 7);
    return dueDate.toISOString();
  }
  
  if (ageRange.includes('-')) {
    const start = ageRange.split('-')[0].trim();
    
    if (start.includes('months')) {
      const months = parseInt(start);
      const dueDate = new Date(birthDate);
      dueDate.setMonth(dueDate.getMonth() + months);
      return dueDate.toISOString();
    }
    
    if (start.includes('years') || !start.includes(' ')) {
      const years = parseInt(start);
      const dueDate = new Date(birthDate);
      dueDate.setFullYear(dueDate.getFullYear() + years);
      return dueDate.toISOString();
    }
  }
  
  if (ageRange.includes('months')) {
    const months = parseInt(ageRange.split(' ')[0]);
    const dueDate = new Date(birthDate);
    dueDate.setMonth(dueDate.getMonth() + months);
    return dueDate.toISOString();
  }
  
  if (ageRange.includes('years')) {
    const years = parseInt(ageRange);
    const dueDate = new Date(birthDate);
    dueDate.setFullYear(dueDate.getFullYear() + years);
    return dueDate.toISOString();
  }
  
  return new Date().toISOString();
}

// Get catch-up vaccine recommendations for a child
export function getCatchupVaccineRecommendations(
  child: Child,
  vaccines: Vaccine[]
): Vaccine[] {
  const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
  const catchupVaccines: Vaccine[] = [];
  
  // Get all administered vaccines
  const administeredVaccines = new Map<string, number>();
  child.vaccineHistory.forEach(dose => {
    const count = administeredVaccines.get(dose.vaccineId) || 0;
    administeredVaccines.set(dose.vaccineId, count + 1);
  });
  
  // Check each vaccine for catch-up eligibility
  vaccines.forEach(vaccine => {
    const administeredDoses = administeredVaccines.get(vaccine.id) || 0;
    
    // If vaccine is not completed
    if (administeredDoses < vaccine.doseCount) {
      // Check if child is in catch-up age range
      if (vaccine.catchupAges && vaccine.catchupAges.some(range => isInCatchupRange(ageInMonths, range))) {
        catchupVaccines.push(vaccine);
      }
    }
  });
  
  return catchupVaccines;
}

// Helper function to determine if a child is in catch-up age range
function isInCatchupRange(ageInMonths: number, catchupRange: string): boolean {
  if (catchupRange.includes('Up to')) {
    const limit = catchupRange.replace('Up to ', '');
    
    if (limit.includes('months')) {
      const months = parseInt(limit);
      return ageInMonths <= months;
    }
    
    if (limit.includes('years')) {
      const years = parseInt(limit);
      return ageInMonths <= years * 12;
    }
  }
  
  return false;
} 