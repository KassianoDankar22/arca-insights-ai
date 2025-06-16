import { CorsHeaders } from "./utils.ts";

export async function handleRetrieveOAIFileContent(data: any, apiKey: string, corsHeaders: HeadersInit, authHeader: string | null) {
  const { fileId } = data;

  if (!fileId) {
    console.error("[ERROR] fileId is required for retrieveOAIFileContent action.");
    return new Response(
      JSON.stringify({
        error: "fileId is required",
        success: false,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  console.log(`[DEBUG] Attempting to retrieve content for fileId: ${fileId}`);
  // console.log(`[DEBUG] Auth header in handleRetrieveOAIFileContent: ${authHeader ? authHeader.substring(0,10) + '...' : 'null'}`);

  try {
    const response = await fetch(`https://api.openai.com/v1/files/${fileId}/content`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        // Não precisa de OpenAI-Beta aqui, pois é uma chamada de arquivo padrão
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[ERROR] OpenAI API error when retrieving file ${fileId}. Status: ${response.status}. Body: ${errorText}`);
      return new Response(
        JSON.stringify({
          error: `Failed to retrieve file content from OpenAI: ${errorText}`,
          success: false,
          details: {
            statusCode: response.status,
            statusText: response.statusText,
          }
        }),
        {
          status: response.status, // Propagar o status do erro da OpenAI
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // O conteúdo do arquivo é o corpo da resposta como texto
    const fileTextContent = await response.text();
    console.log(`[DEBUG] Successfully retrieved content for fileId: ${fileId}. Content length: ${fileTextContent.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        content: fileTextContent,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error(`[ERROR] Unexpected error in handleRetrieveOAIFileContent for fileId ${fileId}:`, error);
    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected server error occurred while retrieving file content.",
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
} 