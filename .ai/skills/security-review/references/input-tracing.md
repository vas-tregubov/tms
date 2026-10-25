# Input Tracing

Trace relevant external request params, POST bodies, headers, uploaded files, and external API data through transformations to use/sink.

Record source/entry point, sink/use, validation, sanitization where needed, and risk if required protection is missing. Cite entry and sink locations, and account for existing pipes, schemas, guards, file/size limits, and output encoding.

TypeScript types are not runtime validation. Validation and sanitization solve different problems; do not demand blanket sanitization. Do not invent payloads without sufficient code evidence. Mark untraceable paths not verified.
