'use client';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon, LoaderIcon, InfoIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import equal from 'fast-deep-equal';
import { cn, sanitizeText } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';

// Type narrowing is handled by TypeScript's control flow analysis
// The AI SDK provides proper discriminated unions for tool calls

const PurePreviewMessage = ({
  chatId,
  message,
  isLoading,
  setMessages,
  regenerate,
  isReadonly,
  requiresScrollPadding,
}: {
  chatId: string;
  message: ChatMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  isReadonly: boolean;
  requiresScrollPadding: boolean;
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const attachmentsFromMessage = message.parts.filter(
    (part) => part.type === 'file',
  );

  useDataStream();

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            'flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
            {
              'w-full': mode === 'edit',
              'group-data-[role=user]/message:w-fit': mode !== 'edit',
            },
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div
            className={cn('flex flex-col gap-4 w-full', {
              'min-h-96': message.role === 'assistant' && requiresScrollPadding,
            })}
          >
            {attachmentsFromMessage.length > 0 && (
              <div
                data-testid={`message-attachments`}
                className="flex flex-row justify-end gap-2"
              >
                {attachmentsFromMessage.map((attachment) => (
                  <PreviewAttachment
                    key={attachment.url}
                    attachment={{
                      name: attachment.filename ?? 'file',
                      contentType: attachment.mediaType,
                      url: attachment.url,
                    }}
                  />
                ))}
              </div>
            )}

            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'reasoning' && part.text?.trim().length > 0) {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.text}
                  />
                );
              }

              if (type === 'text') {
                if (mode === 'view') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === 'user' && !isReadonly && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              data-testid="message-edit-button"
                              variant="ghost"
                              className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                              onClick={() => {
                                setMode('edit');
                              }}
                            >
                              <PencilEditIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit message</TooltipContent>
                        </Tooltip>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn('flex flex-col gap-4', {
                          'bg-primary text-primary-foreground px-3 py-2 rounded-xl':
                            message.role === 'user',
                        })}
                      >
                        <Markdown>{sanitizeText(part.text)}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === 'edit') {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        regenerate={regenerate}
                      />
                    </div>
                  );
                }
              }

              // Weather tool UI removed

              if (type === 'tool-createDocument') {
                const { toolCallId, state } = part;

                if (state === 'input-available') {
                  const { input } = part;
                  return (
                    <div key={toolCallId}>
                      <DocumentPreview isReadonly={isReadonly} args={input} />
                    </div>
                  );
                }

                if (state === 'output-available') {
                  const { output } = part;

                  if ('error' in output) {
                    return (
                      <div
                        key={toolCallId}
                        className="text-red-500 p-2 border rounded"
                      >
                        Error: {String(output.error)}
                      </div>
                    );
                  }

                  return (
                    <div key={toolCallId}>
                      <DocumentPreview
                        isReadonly={isReadonly}
                        result={output}
                      />
                    </div>
                  );
                }
              }

              if (type === 'tool-updateDocument') {
                const { toolCallId, state } = part;

                if (state === 'input-available') {
                  const { input } = part;

                  return (
                    <div key={toolCallId}>
                      <DocumentToolCall
                        type="update"
                        args={input}
                        isReadonly={isReadonly}
                      />
                    </div>
                  );
                }

                if (state === 'output-available') {
                  const { output } = part;

                  if ('error' in output) {
                    return (
                      <div
                        key={toolCallId}
                        className="text-red-500 p-2 border rounded"
                      >
                        Error: {String(output.error)}
                      </div>
                    );
                  }

                  return (
                    <div key={toolCallId}>
                      <DocumentToolResult
                        type="update"
                        result={output}
                        isReadonly={isReadonly}
                      />
                    </div>
                  );
                }
              }

              // request-suggestions tool UI removed
              // --- Web3 tool badges ---
              if (type === 'tool-getBlockNumber') {
                const { toolCallId, state } = part as any;
                if (state === 'input-available') {
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <span className="animate-spin"><LoaderIcon /></span> Checking latest block...
                    </div>
                  );
                }
                if (state === 'output-available') {
                  const { output } = part as any;
                  if ('error' in output) {
                    return (
                      <div key={toolCallId} className="text-red-500 p-2 border rounded text-xs w-fit">Error: {String(output.error)}</div>
                    );
                  }
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <InfoIcon /> Block #{output.blockNumber}
                    </div>
                  );
                }
              }

              if (type === 'tool-getTokenBalance') {
                const { toolCallId, state } = part as any;
                if (state === 'input-available') {
                  const { input } = part as any;
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <span className="animate-spin"><LoaderIcon /></span> Checking token balance...
                    </div>
                  );
                }
                if (state === 'output-available') {
                  const { output } = part as any;
                  if ('error' in output) {
                    return (
                      <div key={toolCallId} className="text-red-500 p-2 border rounded text-xs w-fit">Error: {String(output.error)}</div>
                    );
                  }
                  const addr: string | undefined = output.address;
                  const short = addr && addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <InfoIcon /> {output.symbol} {output.balance}{short ? ` • ${short}` : ''}
                    </div>
                  );
                }
              }

              if (type === 'tool-resolveENSName') {
                const { toolCallId, state } = part as any;
                if (state === 'input-available') {
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <span className="animate-spin"><LoaderIcon /></span> Resolving ENS...
                    </div>
                  );
                }
                if (state === 'output-available') {
                  const { output } = part as any;
                  if ('error' in output) {
                    return (
                      <div key={toolCallId} className="text-red-500 p-2 border rounded text-xs w-fit">Error: {String(output.error)}</div>
                    );
                  }
                  const addr: string | null = output.address;
                  const short = addr && addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <InfoIcon /> {output.name} → {short ?? 'not set'}
                    </div>
                  );
                }
              }

              if (type === 'tool-lookupENSName') {
                const { toolCallId, state } = part as any;
                if (state === 'input-available') {
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <span className="animate-spin"><LoaderIcon /></span> Looking up ENS...
                    </div>
                  );
                }
                if (state === 'output-available') {
                  const { output } = part as any;
                  if ('error' in output) {
                    return (
                      <div key={toolCallId} className="text-red-500 p-2 border rounded text-xs w-fit">Error: {String(output.error)}</div>
                    );
                  }
                  const addr: string = output.address;
                  const short = addr && addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
                  return (
                    <div key={toolCallId} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border bg-muted text-muted-foreground w-fit">
                      <InfoIcon /> {short} → {output.name ?? 'no ENS'}
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.requiresScrollPadding !== nextProps.requiresScrollPadding)
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return false;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message min-h-96"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};
