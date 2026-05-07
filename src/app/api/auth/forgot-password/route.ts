export async function POST() {
  return Response.json(
    {
      error:
        "Password reset is temporarily unavailable. Please contact eng@oximy.com for help.",
    },
    { status: 503 }
  );
}
