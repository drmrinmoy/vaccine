import { Patient, Procedure, SurgicalSchedule } from '@/types';

/**
 * Calculate the age of a person from their date of birth
 * @param dateOfBirth - Date of birth in ISO format
 * @returns Age string in a human-readable format
 */
export function formatAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return `${age} years old`;
}

/**
 * Calculate age in months
 * @param dateOfBirth - Date of birth in ISO format
 * @returns Age in months
 */
export function getAgeInMonths(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  return (today.getFullYear() - birthDate.getFullYear()) * 12 + 
         (today.getMonth() - birthDate.getMonth());
}

/**
 * Get procedure recommendations for a patient based on their age
 * @param patient - Patient data
 * @param procedures - Array of procedures
 * @param surgicalSchedule - Surgical schedule data
 * @returns Array of recommended procedures
 */
export function getProcedureRecommendations(
  patient: Patient,
  procedures: Procedure[],
  surgicalSchedule: SurgicalSchedule
): Procedure[] {
  const ageInMonths = getAgeInMonths(patient.dateOfBirth);
  const patientProcedureIds = patient.procedureHistory.map(record => record.procedureId);
  
  // Get procedures from the schedule that are appropriate for the patient's age
  // and haven't already been performed
  const recommendedProcedureIds = surgicalSchedule.procedures
    .filter(item => 
      item.recommended && 
      ageInMonths >= item.ageInMonths && 
      !patientProcedureIds.includes(item.procedureId)
    )
    .map(item => item.procedureId);
  
  // Get full procedure objects for the recommended procedures
  return procedures.filter(procedure => recommendedProcedureIds.includes(procedure.id));
}

/**
 * Check if a patient is due for any procedures
 * @param patient - Patient data
 * @param procedures - Array of procedures
 * @param surgicalSchedule - Surgical schedule data
 * @returns true if patient is due for any procedures
 */
export function isPatientDueForProcedures(
  patient: Patient,
  procedures: Procedure[],
  surgicalSchedule: SurgicalSchedule
): boolean {
  const recommendations = getProcedureRecommendations(patient, procedures, surgicalSchedule);
  return recommendations.length > 0;
}

/**
 * Calculate surgical risk based on patient data
 * @param patient - Patient data
 * @returns Risk level: 'Low', 'Moderate', or 'High'
 */
export function calculateSurgicalRisk(patient: Patient): 'Low' | 'Moderate' | 'High' {
  // This is a simplified risk calculation for demo purposes
  // In a real app, this would implement a validated surgical risk algorithm
  
  let riskScore = 0;
  
  // Age factor
  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
  if (age > 70) riskScore += 3;
  else if (age > 60) riskScore += 2;
  else if (age > 50) riskScore += 1;
  
  // BMI factor (if available)
  if (patient.height && patient.weight) {
    const bmi = patient.weight / Math.pow(patient.height / 100, 2);
    if (bmi > 35) riskScore += 3;
    else if (bmi > 30) riskScore += 2;
    else if (bmi > 25) riskScore += 1;
  }
  
  // Blood pressure factor (if available)
  if (patient.bloodPressure) {
    const systolic = parseInt(patient.bloodPressure.split('/')[0]);
    if (systolic > 160) riskScore += 3;
    else if (systolic > 140) riskScore += 2;
    else if (systolic > 130) riskScore += 1;
  }
  
  // Determine risk level based on score
  if (riskScore >= 5) return 'High';
  else if (riskScore >= 3) return 'Moderate';
  else return 'Low';
} 