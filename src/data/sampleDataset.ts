import { Expense } from '../types';

// Helper to format Date to YYYY-MM-DD
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates a realistic academic research dataset covering ~50 consecutive calendar days.
 * Includes natural student spending rhythms (spikes before project deadlines, weekends, mobile recharges, printouts).
 */
export function generateSampleExpenses(anchorDate: Date = new Date()): Expense[] {
  const anchor = new Date(anchorDate);
  // Strip time for clean date math
  anchor.setHours(0, 0, 0, 0);

  // Define 62 realistic student expense templates with relative day offsets (-48 to -1 days)
  const templates: Array<{
    daysAgo: number;
    amount: number;
    category: Expense['category'];
    description: string;
  }> = [
    // Week 1 (48 to 42 days ago)
    { daysAgo: 48, amount: 666, category: 'Recharge', description: 'Quarterly 5G 84-day student mobile data pack' },
    { daysAgo: 48, amount: 85, category: 'Food', description: 'College cafeteria lunch thali' },
    { daysAgo: 47, amount: 40, category: 'Travel', description: 'Metro card reload for daily commute' },
    { daysAgo: 47, amount: 35, category: 'Food', description: 'Afternoon tea & samosa at college canteen' },
    { daysAgo: 46, amount: 480, category: 'Education', description: 'Data Structures & Algorithms reference textbook' },
    { daysAgo: 46, amount: 30, category: 'Printing', description: 'Assignment 1 problem set printouts (6 pages)' },
    { daysAgo: 45, amount: 95, category: 'Food', description: 'Evening fried rice combo with lab partner' },
    { daysAgo: 44, amount: 50, category: 'Travel', description: 'Shared auto-rickshaw to campus' },
    { daysAgo: 43, amount: 280, category: 'Entertainment', description: 'Weekend movie ticket with batchmates' },
    { daysAgo: 42, amount: 120, category: 'Other', description: 'Exam stationery, pens, geometry kit' },

    // Week 2 (41 to 35 days ago)
    { daysAgo: 41, amount: 110, category: 'Food', description: 'Campus canteen lunch and lemon soda' },
    { daysAgo: 40, amount: 45, category: 'Travel', description: 'Metro card tap reload' },
    { daysAgo: 40, amount: 55, category: 'Food', description: 'Hostel mess evening tea & biscuit pack' },
    { daysAgo: 39, amount: 320, category: 'Project', description: 'ESP32 development board and breadboard kit' },
    { daysAgo: 38, amount: 45, category: 'Printing', description: 'Operating Systems lab manual printouts' },
    { daysAgo: 38, amount: 75, category: 'Food', description: 'Lunch roll from food truck near gate 2' },
    { daysAgo: 37, amount: 160, category: 'Other', description: 'Hostel laundry washing & pressing' },
    { daysAgo: 36, amount: 220, category: 'Entertainment', description: 'Hostel dorm pizza party contribution' },
    { daysAgo: 35, amount: 60, category: 'Travel', description: 'Bus pass weekly renewal' },

    // Week 3 (34 to 28 days ago)
    { daysAgo: 34, amount: 90, category: 'Food', description: 'Campus cafeteria meal' },
    { daysAgo: 33, amount: 350, category: 'Project', description: 'DHT22 sensors and ultrasonic module for project' },
    { daysAgo: 33, amount: 40, category: 'Travel', description: 'Metro smart card recharge' },
    { daysAgo: 32, amount: 130, category: 'Food', description: 'Lunch with study group at college street eatery' },
    { daysAgo: 31, amount: 65, category: 'Printing', description: 'Computer Networks mini-project documentation' },
    { daysAgo: 30, amount: 299, category: 'Entertainment', description: 'Shared Spotify and academic tools subscription' },
    { daysAgo: 29, amount: 140, category: 'Other', description: 'Prescribed allergy medicine from campus pharmacy' },
    { daysAgo: 28, amount: 80, category: 'Food', description: 'Evening canteen dosa' },

    // Week 4 (27 to 21 days ago)
    { daysAgo: 27, amount: 40, category: 'Travel', description: 'Metro commute travel' },
    { daysAgo: 27, amount: 105, category: 'Food', description: 'Healthy salad & juice near campus gym' },
    { daysAgo: 26, amount: 550, category: 'Education', description: 'IEEE Student Branch annual membership fee' },
    { daysAgo: 25, amount: 35, category: 'Food', description: 'Campus tea stall cutting chai & biscuits' },
    { daysAgo: 24, amount: 90, category: 'Printing', description: 'Colored block diagrams & circuit schematics' },
    { daysAgo: 23, amount: 420, category: 'Project', description: 'Microcontroller power adapter and jumper cables' },
    { daysAgo: 22, amount: 180, category: 'Entertainment', description: 'Weekend cafe study session with friends' },
    { daysAgo: 21, amount: 50, category: 'Travel', description: 'Auto-rickshaw return from hardware market' },

    // Week 5 (20 to 14 days ago)
    { daysAgo: 20, amount: 95, category: 'Food', description: 'Hostel mess lunch' },
    { daysAgo: 19, amount: 40, category: 'Travel', description: 'Metro recharge' },
    { daysAgo: 19, amount: 120, category: 'Food', description: 'Dinner with group after hackathon prep' },
    { daysAgo: 18, amount: 80, category: 'Printing', description: 'Mid-term assignment binding & cover sheets' },
    { daysAgo: 17, amount: 299, category: 'Recharge', description: 'Mobile data top-up pack for online research' },
    { daysAgo: 16, amount: 75, category: 'Food', description: 'College canteen lunch' },
    { daysAgo: 15, amount: 150, category: 'Entertainment', description: 'Campus cultural fest entry pass' },
    { daysAgo: 14, amount: 65, category: 'Other', description: 'Stationery, sticky notes, whiteboard markers' },

    // Week 6 - Pre-Test / Training Boundary (13 to 8 days ago)
    { daysAgo: 13, amount: 110, category: 'Food', description: 'Canteen lunch & cold coffee' },
    { daysAgo: 12, amount: 40, category: 'Travel', description: 'Metro card tap reload' },
    { daysAgo: 12, amount: 240, category: 'Project', description: 'Cloud GPU credits for model evaluation' },
    { daysAgo: 11, amount: 85, category: 'Food', description: 'Evening snacks with project teammates' },
    { daysAgo: 10, amount: 120, category: 'Printing', description: 'Research paper draft xerox & spiral binding' },
    { daysAgo: 9, amount: 90, category: 'Food', description: 'College mess lunch coupon' },
    { daysAgo: 8, amount: 50, category: 'Travel', description: 'Shared auto fare to library' },

    // Week 7 - Last 7 Days (HOLD-OUT TEST PERIOD FOR EXPERIMENT)
    // Days 7 to 1 days ago - ground truth actual values
    { daysAgo: 7, amount: 130, category: 'Food', description: 'Lunch and juice during conference prep' },
    { daysAgo: 7, amount: 40, category: 'Travel', description: 'Metro travel fare' },
    { daysAgo: 6, amount: 45, category: 'Food', description: 'Canteen snacks' },
    { daysAgo: 6, amount: 70, category: 'Printing', description: 'Poster presentation high-res A3 print' },
    { daysAgo: 5, amount: 140, category: 'Food', description: 'Team dinner after lab presentation rehearsal' },
    { daysAgo: 4, amount: 60, category: 'Travel', description: 'Auto-rickshaw to technical printing center' },
    { daysAgo: 4, amount: 85, category: 'Food', description: 'Quick lunch between lectures' },
    { daysAgo: 3, amount: 220, category: 'Project', description: 'Replacement sensor component & header pins' },
    { daysAgo: 2, amount: 95, category: 'Food', description: 'College canteen lunch and hot tea' },
    { daysAgo: 2, amount: 35, category: 'Travel', description: 'Bus commute fare' },
    { daysAgo: 1, amount: 110, category: 'Food', description: 'Evening meal with research study group' },
    { daysAgo: 1, amount: 55, category: 'Printing', description: 'Final report appendix & declaration copies' },
  ];

  return templates.map((item, index) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - item.daysAgo);
    return {
      id: `exp_sample_${index + 1}_${item.daysAgo}d`,
      date: formatDate(d),
      amount: item.amount,
      category: item.category,
      description: item.description,
      createdAt: d.getTime() + index * 60000,
    };
  });
}
