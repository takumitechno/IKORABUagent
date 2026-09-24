#!/usr/bin/env bun
import { B1_EMPLOYEE_IDS } from "../web/lib/employee-runner";
import { EMPLOYEE_ROLE_REGISTRY } from "../web/lib/agent-role-registry";

const slug = process.argv[2] ?? "";
const employee = EMPLOYEE_ROLE_REGISTRY.find((entry) => entry.agent_id === slug);
console.log(employee ? (B1_EMPLOYEE_IDS.includes(employee.agent_id as typeof B1_EMPLOYEE_IDS[number]) ? "b1" : "registered") : "none");
