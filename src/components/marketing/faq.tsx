import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "Os documentos gerados têm validade legal?",
    answer:
      "Sim. Os modelos seguem a estrutura usual de declarações, recibos e contratos utilizados no Brasil. Ainda assim, para casos de maior complexidade ou valor, recomendamos revisão de um advogado.",
  },
  {
    question: "Preciso assinar o documento depois de gerado?",
    answer:
      "Sim. O DocFácil gera o PDF pronto para impressão e assinatura manual. Em muitos casos, o reconhecimento de firma em cartório aumenta a segurança jurídica.",
  },
  {
    question: "O plano gratuito tem algum limite?",
    answer:
      "O plano gratuito permite gerar até 5 documentos por mês, com uma marca d'água discreta no PDF. O plano Premium remove esse limite e a marca d'água.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Seus dados são armazenados de forma criptografada e tratados em conformidade com a LGPD. Você pode solicitar a exportação ou exclusão dos seus dados a qualquer momento.",
  },
  {
    question: "Posso editar um documento depois de gerado?",
    answer:
      "Sim. Todos os documentos ficam salvos no seu painel e podem ser editados, duplicados ou baixados novamente quando quiser.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Perguntas frequentes
        </h2>
      </div>

      <Accordion className="mt-10 w-full">
        {FAQ_ITEMS.map((item, index) => (
          <AccordionItem key={item.question} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
