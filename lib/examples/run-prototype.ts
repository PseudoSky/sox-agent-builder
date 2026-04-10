/**
 * Prototype Test: Customer Support Team Execution
 *
 * This demonstrates the end-to-end workflow:
 * 1. Create a team specification
 * 2. Initialize the orchestrator
 * 3. Execute a multi-agent workflow
 * 4. Observe agent-to-agent communication
 * 5. Track metrics and costs
 */

import { WorkflowOrchestrator } from '../workflow-orchestrator';
import {
  supportTeamSpec,
  supportTeamComposition,
  supportTeamWorkflow,
} from './customer-support-team';

/**
 * Run the prototype
 */
async function runPrototype() {
  console.log('='.repeat(80));
  console.log('PROTOTYPE: Multi-Agent Customer Support Team');
  console.log('='.repeat(80));
  console.log();

  // Test inputs
  const testInputs = [
    {
      title: 'Technical Issue',
      input:
        'I am unable to login to my account. I keep getting an "invalid credentials" error even though I know my password is correct.',
    },
    {
      title: 'Billing Question',
      input:
        'Why was I charged twice for my subscription this month? I only have one account.',
    },
    {
      title: 'General Question',
      input: 'How do I export my data from the application?',
    },
  ];

  for (const test of testInputs) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`TEST: ${test.title}`);
    console.log(`${'─'.repeat(80)}`);
    console.log(`\nCustomer: "${test.input}"\n`);

    try {
      // Initialize orchestrator
      const orchestrator = new WorkflowOrchestrator(
        supportTeamWorkflow,
        supportTeamComposition
      );

      // Execute the workflow
      console.log('Starting workflow execution...\n');
      const result = await orchestrator.execute(test.input);

      // Display results
      if (result.success) {
        console.log('\n✅ Workflow completed successfully\n');

        console.log('=== FINAL RESPONSE ===');
        if (typeof result.output === 'string') {
          console.log(result.output);
        } else {
          console.log(JSON.stringify(result.output, null, 2));
        }

        console.log('\n=== EXECUTION METRICS ===');
        const metrics = orchestrator.getMetrics();

        console.log(`Total Steps Executed: ${metrics.total_steps}`);
        console.log(`Total Tokens Used: ${metrics.total_tokens}`);
        console.log(`Total Cost: $${metrics.total_cost.toFixed(6)}`);
        console.log(`Total Latency: ${result.latency_ms}ms`);
        console.log(`Messages Exchanged: ${metrics.messages_exchanged}`);

        console.log('\n=== STEP-BY-STEP EXECUTION ===');
        for (const step of result.execution_trace.steps) {
          console.log(
            `\n  Step: ${step.step_id} (Agent: ${step.agent_id})`
          );
          console.log(`    Duration: ${step.completed_at - step.started_at}ms`);
          console.log(`    Tokens: ${step.tokens_used}`);
          console.log(`    Cost: $${step.cost.toFixed(6)}`);
          const outputs = step.outputs as Record<string, any>;
          if (outputs.response) {
            const preview = String(outputs.response).substring(0, 100);
            console.log(`    Output: ${preview}...`);
          }
        }

        console.log('\n=== CONVERSATION HISTORY ===');
        if (metrics.conversation_history.length > 0) {
          for (const turn of metrics.conversation_history) {
            const preview = turn.output.substring(0, 80);
            console.log(`  ${turn.agent_id}: ${preview}...`);
          }
        }
      } else {
        console.log('\n❌ Workflow failed\n');
        console.log('Error:', result.output);
      }
    } catch (error) {
      console.error('\n❌ Error running workflow:', error);
    }
  }

  console.log(`\n${'═'.repeat(80)}`);
  console.log('PROTOTYPE TESTING COMPLETE');
  console.log('═'.repeat(80));
}

// Run if called directly
if (require.main === module) {
  runPrototype().catch(console.error);
}

export { runPrototype };
