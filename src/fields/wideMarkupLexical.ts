import type { TextFieldSingleValidation } from 'payload'
import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  TextStateFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { HighlightFeature } from '@/features/highlight/feature.server'

export const wideMarkupLexical = lexicalEditor({
  features: ({ rootFeatures }) => {
    const filtered = rootFeatures.filter((f) => {
      if (!f || typeof f !== 'object' || !('key' in f)) return true
      return !['paragraph', 'heading', 'blockquote', 'list', 'table'].includes(f.key as string)
    })

    return [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlockquoteFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      ChecklistFeature(),
      EXPERIMENTAL_TableFeature(),
      ...filtered,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      SubscriptFeature(),
      SuperscriptFeature(),
      InlineCodeFeature(),
      AlignFeature(),
      IndentFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'news'],
        fields: ({ defaultFields }) => {
          const withoutUrl = defaultFields.filter((f) => !('name' in f && f.name === 'url'))
          return [
            ...withoutUrl,
            {
              name: 'url',
              type: 'text',
              admin: { condition: (_d, sib) => sib?.linkType !== 'internal' },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
              validate: ((value, options) => {
                if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
                return value ? true : 'URL is required'
              }) as TextFieldSingleValidation,
            },
          ]
        },
      }),
      RelationshipFeature({ enabledCollections: ['pages', 'news'] }),
      UploadFeature({
        collections: {
          media: {
            fields: [{ name: 'altText', type: 'text', label: 'Alt text override' }],
          },
        },
      }),
      HorizontalRuleFeature(),
      TextStateFeature({
        state: {
          color: {
            primary: { label: 'Primary', css: { color: '#0066FF' } },
            success: { label: 'Success', css: { color: '#00C853' } },
            warning: { label: 'Warning', css: { color: '#FF9100' } },
            danger: { label: 'Danger', css: { color: '#D32F2F' } },
            muted: { label: 'Muted', css: { color: '#9E9E9E' } },
          },
        },
      }),
      HighlightFeature(),
    ]
  },
})
