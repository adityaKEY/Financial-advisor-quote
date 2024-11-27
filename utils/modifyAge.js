// The input object
let investmentObject = {
  Investment_objective: "Life Protection",
  Annual_Income: "2-5",
  Current_life_stage: "Single",
  Risk_reward_ratio: "High returns with high risk",
  Payment_type_product_recommendation: "Single",
  Investment_horizon: "Short term",
  Age: 25,
};

// Define the conditions for each type of investment objective and age range
const conditions = [
  {
    Investment_objective: ["Life Protection"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: [
      "Single",
      "Married",
      "Married with children",
      "Nearing retirement",
      "Retired",
    ],
    Risk_reward_ratio: [
      "Moderate return at moderate risk",
      "Conservative returns at low risk",
    ],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-36",
  },
  {
    Investment_objective: ["Life Protection"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: ["Single", "Married", "Married with children"],
    Risk_reward_ratio: ["High returns with high risk"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-60",
  },
  {
    Investment_objective: ["Life Protection"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: ["Single", "Married", "Married with children"],
    Risk_reward_ratio: ["High returns with high risk"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "60-150",
  },
  {
    Investment_objective: ["Life Protection"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: ["Nearing retirement", "Retired"],
    Risk_reward_ratio: [
      "Moderate return at moderate risk",
      "Conservative returns at low risk",
    ],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "40-150",
  },
  {
    Investment_objective: ["Life Protection"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: ["Single", "Married", "Married with children"],
    Risk_reward_ratio: ["Guaranteed returns"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-150",
  },
  {
    Investment_objective: [
      "Child Education",
      "Marriage",
      "Wealth creation",
      "Protection from illness",
      "Specific goal",
    ],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: ["Married", "Married with children"],
    Risk_reward_ratio: [
      "Moderate return at moderate risk",
      "Conservative returns at low risk",
    ],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-150",
  },
  {
    Investment_objective: ["Retirement planning corpus"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: [
      "Single",
      "Married",
      "Married with children",
      "Nearing retirement",
      "Retired",
    ],
    Risk_reward_ratio: ["High returns with high risk"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-150",
  },
  {
    Investment_objective: ["Regular Income"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: [
      "Single",
      "Married",
      "Married with children",
      "Nearing retirement",
      "Retired",
    ],
    Risk_reward_ratio: ["Guaranteed returns"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "18-60",
  },
  {
    Investment_objective: ["Regular Income"],
    Annual_Income: ["2-5", "5-7", "7-10", "10-15", "15-20", ">20"],
    Current_life_stage: [
      "Single",
      "Married",
      "Married with children",
      "Nearing retirement",
      "Retired",
    ],
    Risk_reward_ratio: ["Guaranteed returns"],
    Payment_type_product_recommendation: ["Single", "Limited", "Regular"],
    Investment_horizon: ["Short term", "Medium term", "Long term"],
    AgeRange: "61-150",
  },
];

// Function to check and modify the Age field based on conditions
async function modifyAge(investmentObject) {
  conditions.forEach((condition) => {
    if (
      condition.Investment_objective.includes(
        investmentObject["Investment_objective"]
      ) &&
      condition.Annual_Income.includes(investmentObject["Annual_Income"]) &&
      condition.Current_life_stage.includes(
        investmentObject["Current_life_stage"]
      ) &&
      condition.Risk_reward_ratio.includes(
        investmentObject["Risk_reward_ratio"]
      ) &&
      condition.Payment_type_product_recommendation.includes(
        investmentObject["Payment_type_product_recommendation"]
      ) &&
      condition.Investment_horizon.includes(
        investmentObject["Investment_horizon"]
      )
    ) {
      // Modify Age field according to AgeRange
      const [minAge, maxAge] = condition.AgeRange.split("-").map(Number);
      if (
        investmentObject["Age"] >= minAge &&
        investmentObject["Age"] <= maxAge
      ) {
        investmentObject["Age"] = condition.AgeRange;
      }
    }
  });
  return investmentObject;
}

module.exports = modifyAge;