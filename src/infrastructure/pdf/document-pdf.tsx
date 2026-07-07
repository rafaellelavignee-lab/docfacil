import path from "node:path"
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { ContentBlock } from "@/modules/templates/domain/content-schema"

const FONTS_DIR = path.join(process.cwd(), "src/infrastructure/pdf/fonts")

Font.register({
  family: "PT Serif",
  fonts: [
    { src: path.join(FONTS_DIR, "PTSerif-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(FONTS_DIR, "PTSerif-Bold.ttf"), fontWeight: "bold" },
    { src: path.join(FONTS_DIR, "PTSerif-Italic.ttf"), fontStyle: "italic" },
  ],
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 90,
    paddingBottom: 70,
    paddingHorizontal: 85,
    fontFamily: "PT Serif",
    fontSize: 11.5,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    position: "absolute",
    top: 32,
    left: 85,
    right: 85,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 85,
    right: 85,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#999999",
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  paragraphCenter: { textAlign: "center" },
  paragraphRight: { textAlign: "right" },
  list: { marginBottom: 10 },
  listItem: {
    marginBottom: 4,
    marginLeft: 14,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 12,
  },
  spacer: { height: 14 },
  signatureBlock: {
    marginTop: 36,
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#333333",
    width: 260,
    paddingTop: 4,
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#666666",
    marginTop: 2,
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: "15%",
    fontSize: 60,
    color: "#000000",
    opacity: 0.06,
    transform: "rotate(-35deg)",
  },
})

interface DocumentPdfProps {
  title: string
  blocks: ContentBlock[]
  watermark?: boolean
  generatedAt: Date
}

export function DocumentPdf({ title, blocks, watermark, generatedAt }: DocumentPdfProps) {
  return (
    <Document title={title} author="DocFácil" creator="DocFácil">
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.header} fixed>
          {title}
        </Text>
        {watermark && (
          <Text style={styles.watermark} fixed>
            DOCFÁCIL
          </Text>
        )}
        {blocks.map((block, index) => renderBlock(block, index))}
        <View style={styles.footer} fixed>
          <Text>Gerado em {generatedAt.toLocaleDateString("pt-BR")} pelo DocFácil</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "title":
      return (
        <Text key={index} style={styles.title}>
          {block.text}
        </Text>
      )
    case "subtitle":
      return (
        <Text key={index} style={styles.subtitle}>
          {block.text}
        </Text>
      )
    case "paragraph": {
      const alignStyle =
        block.align === "center"
          ? styles.paragraphCenter
          : block.align === "right"
            ? styles.paragraphRight
            : undefined
      return (
        <Text
          key={index}
          style={alignStyle ? [styles.paragraph, alignStyle] : styles.paragraph}
        >
          {block.text}
        </Text>
      )
    }
    case "fieldLine":
      return (
        <Text key={index} style={styles.paragraph}>
          {block.text}
        </Text>
      )
    case "list":
      return (
        <View key={index} style={styles.list}>
          {block.items?.map((item, itemIndex) => (
            <Text key={itemIndex} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>
      )
    case "divider":
      return <View key={index} style={styles.divider} />
    case "spacer":
      return <View key={index} style={styles.spacer} />
    case "signature":
      return (
        <View key={index} style={styles.signatureBlock}>
          <View style={styles.signatureLine}>
            <Text>{block.text}</Text>
            {block.signatureLabel && (
              <Text style={styles.signatureLabel}>{block.signatureLabel}</Text>
            )}
          </View>
        </View>
      )
    default:
      return null
  }
}
