import SimulationEditorClient from './SimulationEditorClient';

export default async function SimulationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SimulationEditorClient simulationId={id} />;
}
