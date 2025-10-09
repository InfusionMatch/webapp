// When creating records, provide defaults for enums:
async createNurseProfile(data: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) {
  try {
    const result = await client.models.NurseProfile.create({
      ...data,
      rating: 0,
      totalVisits: 0,
      completedVisits: 0,
      monthlyEarnings: 0,
      lifetimeEarnings: 0,
      onboardingComplete: false,
      onboardingStep: 0,
      isAvailable: true,
      accountStatus: 'active' // Default enum value
    });
    
    return result.data;
  } catch (error) {
    console.error('Error creating nurse profile:', error);
    throw error;
  }
},