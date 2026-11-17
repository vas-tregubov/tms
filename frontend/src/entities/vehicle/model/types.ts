export type Vehicle = {
  id: string
  registrationNumber: string
  type: string
  // Whole kilograms; fractional capacity is represented only by volume.
  maxWeightKg: number
  maxVolumeM3: number
  status: string
}
