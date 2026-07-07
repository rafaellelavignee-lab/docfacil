import {
  PrismaClient,
  Prisma,
  TemplateStatus,
  PlanInterval,
} from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import type { FieldSchema } from "../src/modules/templates/domain/field-schema"
import type { ContentSchema } from "../src/modules/templates/domain/content-schema"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const UF_OPTIONS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
].map((uf) => ({ label: uf, value: uf }))

const CATEGORIES = [
  {
    name: "Pessoal",
    slug: "pessoal",
    description: "Declarações e documentos do dia a dia.",
    icon: "user",
    order: 1,
  },
  {
    name: "Financeiro",
    slug: "financeiro",
    description: "Recibos e comprovantes financeiros.",
    icon: "banknote",
    order: 2,
  },
  {
    name: "Contratos",
    slug: "contratos",
    description: "Contratos de prestação de serviço, compra e venda e locação.",
    icon: "file-signature",
    order: 3,
  },
  {
    name: "Empresas",
    slug: "empresas",
    description: "Documentos para pequenos negócios.",
    icon: "building-2",
    order: 4,
  },
  {
    name: "Família",
    slug: "familia",
    description: "Documentos familiares e de responsabilidade.",
    icon: "users",
    order: 5,
  },
  {
    name: "Imóveis",
    slug: "imoveis",
    description: "Documentos para locação e negociação de imóveis.",
    icon: "home",
    order: 6,
  },
  {
    name: "Veículos",
    slug: "veiculos",
    description: "Documentos para compra, venda e uso de veículos.",
    icon: "car",
    order: 7,
  },
  {
    name: "Trabalho",
    slug: "trabalho",
    description: "Cartas e documentos trabalhistas.",
    icon: "briefcase",
    order: 8,
  },
  {
    name: "Educação",
    slug: "educacao",
    description: "Documentos para uso escolar e acadêmico.",
    icon: "graduation-cap",
    order: 9,
  },
] as const

type SeedTemplate = {
  name: string
  slug: string
  categorySlug: (typeof CATEGORIES)[number]["slug"]
  description: string
  whenToUse: string
  howToUse: string
  faq: { question: string; answer: string }[]
  seoTitle: string
  seoDescription: string
  fieldsSchema: FieldSchema[]
  contentSchema: ContentSchema
}

const TEMPLATES: SeedTemplate[] = [
  {
    name: "Declaração de Residência",
    slug: "declaracao-residencia",
    categorySlug: "pessoal",
    description:
      "Declare seu endereço de residência para apresentar em bancos, escolas, concursos e outras instituições que exigem comprovação.",
    whenToUse:
      "Use quando precisar comprovar seu endereço para instituições que não aceitam apenas contas de consumo, como bancos, escolas, concursos públicos e cadastros em geral.",
    howToUse:
      "Preencha seus dados pessoais e o endereço completo. Ao final, revise o texto gerado, baixe o PDF e assine — à mão ou digitalmente — antes de entregar.",
    faq: [
      {
        question: "A declaração de residência tem validade legal?",
        answer:
          "Sim, é um documento declaratório que tem validade legal como afirmação de próprio punho, sujeita às penalidades do art. 299 do Código Penal em caso de falsidade.",
      },
      {
        question: "Preciso reconhecer firma em cartório?",
        answer:
          "Depende da instituição que vai receber o documento. Muitas aceitam sem reconhecimento de firma, mas é recomendável confirmar antes.",
      },
    ],
    seoTitle: "Declaração de Residência Grátis — Gere em Minutos",
    seoDescription:
      "Gere sua declaração de residência em PDF profissional, pronta para assinar e entregar.",
    fieldsSchema: [
      {
        key: "nome",
        label: "Nome completo",
        type: "text",
        required: true,
        placeholder: "Ex: Maria da Silva Santos",
      },
      {
        key: "cpf",
        label: "CPF",
        type: "cpf",
        required: true,
        placeholder: "000.000.000-00",
      },
      {
        key: "endereco",
        label: "Endereço completo",
        type: "text",
        required: true,
        placeholder: "Rua, número, bairro",
        help: "Informe rua, número e bairro.",
      },
      {
        key: "cidade",
        label: "Cidade",
        type: "text",
        required: true,
        placeholder: "Ex: Fortaleza",
      },
      {
        key: "estado",
        label: "Estado",
        type: "select",
        required: true,
        options: UF_OPTIONS,
      },
      { key: "cep", label: "CEP", type: "cep", required: true, placeholder: "00000-000" },
      { key: "data", label: "Data da declaração", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "DECLARAÇÃO DE RESIDÊNCIA" },
        {
          type: "paragraph",
          text: "Eu, {{nome}}, portador(a) do CPF nº {{cpf}}, declaro para os devidos fins que resido no seguinte endereço: {{endereco}}, {{cidade}} - {{estado}}, CEP {{cep}}.",
        },
        {
          type: "paragraph",
          text: "Declaro estar ciente de que esta declaração é feita sob minha inteira responsabilidade, estando sujeito(a) às penalidades previstas em lei em caso de falsidade (art. 299 do Código Penal).",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        {
          type: "signature",
          text: "{{nome}}",
          signatureLabel: "Assinatura do Declarante",
        },
      ],
    },
  },
  {
    name: "Recibo Simples",
    slug: "recibo-simples",
    categorySlug: "financeiro",
    description:
      "Formalize o pagamento de um produto ou serviço com um recibo simples e profissional, com plena e geral quitação.",
    whenToUse:
      "Use sempre que receber um pagamento por um produto ou serviço e quiser formalizar a quitação por escrito.",
    howToUse:
      "Informe quem paga, quem recebe, o valor e a que se refere o pagamento. Gere o PDF e colete a assinatura de quem recebeu o valor.",
    faq: [
      {
        question: "Recibo simples substitui nota fiscal?",
        answer:
          "Não. O recibo comprova o pagamento entre as partes, mas não substitui a emissão de nota fiscal quando exigida por lei.",
      },
    ],
    seoTitle: "Recibo Simples Grátis — Gere em Minutos",
    seoDescription:
      "Gere um recibo de pagamento profissional em PDF, pronto para assinar.",
    fieldsSchema: [
      {
        key: "recebedorNome",
        label: "Nome de quem recebe",
        type: "text",
        required: true,
      },
      { key: "recebedorCpf", label: "CPF de quem recebe", type: "cpf", required: true },
      { key: "pagadorNome", label: "Nome de quem paga", type: "text", required: true },
      { key: "pagadorCpf", label: "CPF de quem paga", type: "cpf", required: true },
      { key: "valor", label: "Valor recebido", type: "currency", required: true },
      {
        key: "valorExtenso",
        label: "Valor por extenso",
        type: "text",
        required: true,
        placeholder: "Ex: mil reais",
        help: "Escreva o valor por extenso.",
      },
      {
        key: "referente",
        label: "Referente a",
        type: "text",
        required: true,
        placeholder: "Descrição do produto ou serviço",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "RECIBO" },
        {
          type: "paragraph",
          text: "Recebi de {{pagadorNome}}, portador(a) do CPF nº {{pagadorCpf}}, a quantia de {{valor}} ({{valorExtenso}}), referente a {{referente}}.",
        },
        {
          type: "paragraph",
          text: "Para maior clareza, firmo o presente recibo, dando plena, geral e irrevogável quitação, para nada mais reclamar em qualquer tempo.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        {
          type: "signature",
          text: "{{recebedorNome}}",
          signatureLabel: "CPF: {{recebedorCpf}}",
        },
      ],
    },
  },
  {
    name: "Contrato de Prestação de Serviço",
    slug: "contrato-prestacao-servico",
    categorySlug: "contratos",
    description:
      "Formalize a prestação de um serviço entre contratante e contratado, com objeto, prazo, valor e forma de pagamento definidos.",
    whenToUse:
      "Use antes de iniciar um serviço combinado com outra pessoa ou empresa, para deixar claro o que foi contratado, o valor e o prazo.",
    howToUse:
      "Preencha os dados das duas partes, descreva o serviço prestado, o valor combinado e o prazo. Gere o PDF e colete a assinatura de ambas as partes.",
    faq: [
      {
        question: "Este contrato serve para qualquer tipo de serviço?",
        answer:
          "Sim, o modelo é genérico e pode ser adaptado para serviços autônomos, freelance ou prestação eventual entre pessoas físicas ou jurídicas.",
      },
      {
        question: "É necessário reconhecer firma?",
        answer:
          "Não é obrigatório, mas reconhecer firma em cartório aumenta a segurança jurídica do contrato.",
      },
    ],
    seoTitle: "Contrato de Prestação de Serviço Grátis — Gere em Minutos",
    seoDescription:
      "Gere um contrato de prestação de serviço profissional em PDF, com cláusulas essenciais já organizadas.",
    fieldsSchema: [
      {
        key: "contratanteNome",
        label: "Nome do contratante",
        type: "text",
        required: true,
      },
      { key: "contratanteCpf", label: "CPF do contratante", type: "cpf", required: true },
      {
        key: "contratanteEndereco",
        label: "Endereço do contratante",
        type: "text",
        required: true,
      },
      {
        key: "contratadoNome",
        label: "Nome do contratado(a)",
        type: "text",
        required: true,
      },
      {
        key: "contratadoCpf",
        label: "CPF do contratado(a)",
        type: "cpf",
        required: true,
      },
      {
        key: "contratadoEndereco",
        label: "Endereço do contratado(a)",
        type: "text",
        required: true,
      },
      {
        key: "objeto",
        label: "Objeto do contrato",
        type: "textarea",
        required: true,
        help: "Descreva detalhadamente o serviço a ser prestado.",
      },
      {
        key: "prazo",
        label: "Prazo de execução",
        type: "text",
        required: true,
        placeholder: "Ex: 30 dias corridos",
      },
      { key: "valor", label: "Valor do serviço", type: "currency", required: true },
      {
        key: "formaPagamento",
        label: "Forma de pagamento",
        type: "text",
        required: true,
        placeholder: "Ex: à vista via PIX",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS" },
        {
          type: "paragraph",
          text: "De um lado, {{contratanteNome}}, portador(a) do CPF nº {{contratanteCpf}}, residente em {{contratanteEndereco}}, doravante denominado(a) CONTRATANTE, e de outro lado {{contratadoNome}}, portador(a) do CPF nº {{contratadoCpf}}, residente em {{contratadoEndereco}}, doravante denominado(a) CONTRATADO(A), firmam o presente contrato mediante as cláusulas a seguir.",
        },
        { type: "subtitle", text: "CLÁUSULA 1ª — DO OBJETO" },
        { type: "paragraph", text: "{{objeto}}" },
        { type: "subtitle", text: "CLÁUSULA 2ª — DO PRAZO" },
        {
          type: "paragraph",
          text: "O serviço será prestado no prazo de {{prazo}}, contado a partir da assinatura deste contrato.",
        },
        { type: "subtitle", text: "CLÁUSULA 3ª — DO VALOR E FORMA DE PAGAMENTO" },
        {
          type: "paragraph",
          text: "Pelo serviço prestado, o CONTRATANTE pagará ao CONTRATADO(A) o valor de {{valor}}, {{formaPagamento}}.",
        },
        { type: "subtitle", text: "CLÁUSULA 4ª — DAS DISPOSIÇÕES GERAIS" },
        {
          type: "paragraph",
          text: "As partes elegem o foro da comarca de {{cidade}} para dirimir quaisquer dúvidas oriundas deste contrato.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{contratanteNome}}", signatureLabel: "CONTRATANTE" },
        {
          type: "signature",
          text: "{{contratadoNome}}",
          signatureLabel: "CONTRATADO(A)",
        },
      ],
    },
  },
  {
    name: "Procuração Simples",
    slug: "procuracao-simples",
    categorySlug: "pessoal",
    description:
      "Conceda poderes a alguém de sua confiança para representá-lo em atos específicos, com prazo de validade definido.",
    whenToUse:
      "Use quando não puder comparecer pessoalmente a um ato e precisar que outra pessoa o represente, como retirar documentos ou assinar em seu nome.",
    howToUse:
      "Informe os dados de quem outorga e de quem recebe os poderes, descreva claramente os poderes concedidos e o prazo de validade.",
    faq: [
      {
        question: "Preciso registrar a procuração em cartório?",
        answer:
          "Para atos de maior complexidade ou valor, recomenda-se reconhecer firma ou lavrar procuração pública em cartório.",
      },
    ],
    seoTitle: "Procuração Simples Grátis — Gere em Minutos",
    seoDescription: "Gere uma procuração particular em PDF, pronta para assinar.",
    fieldsSchema: [
      {
        key: "outorganteNome",
        label: "Nome do outorgante",
        type: "text",
        required: true,
        help: "Quem está concedendo os poderes.",
      },
      { key: "outorganteCpf", label: "CPF do outorgante", type: "cpf", required: true },
      {
        key: "outorganteEndereco",
        label: "Endereço do outorgante",
        type: "text",
        required: true,
      },
      {
        key: "outorgadoNome",
        label: "Nome do outorgado(a)",
        type: "text",
        required: true,
        help: "Quem vai receber os poderes.",
      },
      { key: "outorgadoCpf", label: "CPF do outorgado(a)", type: "cpf", required: true },
      {
        key: "outorgadoEndereco",
        label: "Endereço do outorgado(a)",
        type: "text",
        required: true,
      },
      {
        key: "poderes",
        label: "Poderes concedidos",
        type: "textarea",
        required: true,
        help: "Descreva especificamente os poderes concedidos.",
      },
      {
        key: "validade",
        label: "Prazo de validade",
        type: "text",
        required: true,
        placeholder: "Ex: 90 dias",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "PROCURAÇÃO" },
        {
          type: "paragraph",
          text: "Pelo presente instrumento particular de procuração, {{outorganteNome}}, portador(a) do CPF nº {{outorganteCpf}}, residente em {{outorganteEndereco}}, nomeia e constitui como seu(sua) bastante procurador(a) {{outorgadoNome}}, portador(a) do CPF nº {{outorgadoCpf}}, residente em {{outorgadoEndereco}}, a quem confere os seguintes poderes:",
        },
        { type: "paragraph", text: "{{poderes}}" },
        {
          type: "paragraph",
          text: "O presente mandato tem validade de {{validade}} a contar desta data.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{outorganteNome}}", signatureLabel: "OUTORGANTE" },
      ],
    },
  },
  {
    name: "Carta de Demissão",
    slug: "carta-demissao",
    categorySlug: "trabalho",
    description:
      "Comunique formalmente sua decisão de se demitir de um cargo, com data de admissão, último dia de trabalho e cargo ocupado.",
    whenToUse:
      "Use quando decidir se desligar voluntariamente de um emprego, para formalizar o pedido junto ao setor de RH.",
    howToUse:
      "Informe seu cargo, empresa, data de admissão e o último dia de trabalho. Gere o PDF, imprima e entregue ao setor de recursos humanos.",
    faq: [
      {
        question: "Preciso avisar com quanto tempo de antecedência?",
        answer:
          "A CLT prevê aviso prévio de 30 dias, salvo acordo diferente com a empresa. Verifique seu contrato de trabalho.",
      },
    ],
    seoTitle: "Carta de Demissão Grátis — Gere em Minutos",
    seoDescription:
      "Gere uma carta de demissão formal em PDF, pronta para entregar ao RH.",
    fieldsSchema: [
      { key: "nome", label: "Nome completo", type: "text", required: true },
      { key: "cargo", label: "Cargo", type: "text", required: true },
      { key: "empresa", label: "Empresa", type: "text", required: true },
      { key: "dataAdmissao", label: "Data de admissão", type: "date", required: true },
      {
        key: "dataDemissao",
        label: "Último dia de trabalho",
        type: "date",
        required: true,
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data da carta", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "CARTA DE DEMISSÃO" },
        {
          type: "paragraph",
          text: "Eu, {{nome}}, ocupante do cargo de {{cargo}} na empresa {{empresa}}, admitido(a) em {{dataAdmissao}}, venho por meio desta comunicar minha decisão de me demitir do referido cargo, com último dia de trabalho em {{dataDemissao}}.",
        },
        {
          type: "paragraph",
          text: "Solicito que sejam providenciadas as formalidades necessárias para a rescisão do meu contrato de trabalho, incluindo o pagamento das verbas rescisórias a que tenho direito.",
        },
        {
          type: "paragraph",
          text: "Agradeço a oportunidade e coloco-me à disposição para o período de transição necessário.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{nome}}" },
      ],
    },
  },
  {
    name: "Declaração de Renda Informal",
    slug: "declaracao-renda-informal",
    categorySlug: "financeiro",
    description:
      "Declare sua renda mensal aproximada quando não possui vínculo empregatício formal, para uso em cadastros, benefícios ou comprovação de renda.",
    whenToUse:
      "Use quando precisar comprovar renda para cadastros, benefícios sociais ou financiamentos, mas não possuir carteira assinada ou holerite.",
    howToUse:
      "Informe seus dados, a atividade que exerce e a renda mensal aproximada. Gere o PDF e assine antes de entregar.",
    faq: [
      {
        question: "Essa declaração substitui a carteira de trabalho?",
        answer:
          "Não. Ela serve como declaração de próprio punho para comprovar renda informal, mas não é um vínculo empregatício formal.",
      },
    ],
    seoTitle: "Declaração de Renda Informal Grátis — Gere em Minutos",
    seoDescription:
      "Gere sua declaração de renda informal em PDF profissional, pronta para assinar e entregar.",
    fieldsSchema: [
      { key: "nome", label: "Nome completo", type: "text", required: true },
      { key: "cpf", label: "CPF", type: "cpf", required: true },
      {
        key: "atividade",
        label: "Atividade que exerce",
        type: "text",
        required: true,
        placeholder: "Ex: cabeleireira autônoma",
      },
      {
        key: "rendaMensal",
        label: "Renda mensal aproximada",
        type: "currency",
        required: true,
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "DECLARAÇÃO DE RENDA" },
        {
          type: "paragraph",
          text: "Eu, {{nome}}, portador(a) do CPF nº {{cpf}}, declaro para os devidos fins que exerço a atividade de {{atividade}}, da qual aufiro renda mensal aproximada de {{rendaMensal}}.",
        },
        {
          type: "paragraph",
          text: "Declaro que não possuo vínculo empregatício formal e que a presente declaração reflete a realidade dos fatos, estando ciente das penalidades previstas em lei em caso de falsidade (art. 299 do Código Penal).",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        {
          type: "signature",
          text: "{{nome}}",
          signatureLabel: "Assinatura do Declarante",
        },
      ],
    },
  },
  {
    name: "Declaração de União Estável",
    slug: "declaracao-uniao-estavel",
    categorySlug: "familia",
    description:
      "Declare a existência de união estável entre duas pessoas, com data de início e endereço comum, para uso em cadastros e benefícios.",
    whenToUse:
      "Use para comprovar a convivência em união estável perante instituições, planos de saúde ou benefícios previdenciários.",
    howToUse:
      "Informe os dados dos dois declarantes, a data de início da convivência e o endereço comum. Gere o PDF e colham as duas assinaturas.",
    faq: [
      {
        question: "Essa declaração tem o mesmo efeito de uma escritura pública?",
        answer:
          "Não. Para efeitos de maior segurança jurídica (como partilha de bens), recomenda-se lavrar escritura pública de união estável em cartório.",
      },
    ],
    seoTitle: "Declaração de União Estável Grátis — Gere em Minutos",
    seoDescription: "Gere uma declaração de união estável em PDF, pronta para assinar.",
    fieldsSchema: [
      {
        key: "nome1",
        label: "Nome do(a) primeiro(a) declarante",
        type: "text",
        required: true,
      },
      {
        key: "cpf1",
        label: "CPF do(a) primeiro(a) declarante",
        type: "cpf",
        required: true,
      },
      {
        key: "nome2",
        label: "Nome do(a) segundo(a) declarante",
        type: "text",
        required: true,
      },
      {
        key: "cpf2",
        label: "CPF do(a) segundo(a) declarante",
        type: "cpf",
        required: true,
      },
      {
        key: "dataInicioUniao",
        label: "Data de início da união",
        type: "date",
        required: true,
      },
      { key: "enderecoComum", label: "Endereço em comum", type: "text", required: true },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "DECLARAÇÃO DE UNIÃO ESTÁVEL" },
        {
          type: "paragraph",
          text: "Nós, {{nome1}}, portador(a) do CPF nº {{cpf1}}, e {{nome2}}, portador(a) do CPF nº {{cpf2}}, declaramos, para os devidos fins e sob as penas da lei, que mantemos união estável desde {{dataInicioUniao}}, convivendo em regime de convivência pública, contínua e duradoura, com o objetivo de constituição de família, residindo em {{enderecoComum}}.",
        },
        {
          type: "paragraph",
          text: "Declaramos estar cientes de que a falsidade desta declaração pode implicar sanções civis e penais previstas em lei.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{nome1}}", signatureLabel: "Declarante 1" },
        { type: "signature", text: "{{nome2}}", signatureLabel: "Declarante 2" },
      ],
    },
  },
  {
    name: "Recibo de Pagamento",
    slug: "recibo-pagamento",
    categorySlug: "financeiro",
    description:
      "Comprove o pagamento de serviços prestados em um período específico, com plena e geral quitação.",
    whenToUse:
      "Use para formalizar pagamentos de serviços avulsos ou prestação de serviço eventual, sem vínculo empregatício.",
    howToUse:
      "Informe quem paga, quem recebe, o valor e o período de referência do pagamento. Gere o PDF e colete a assinatura de quem recebeu.",
    faq: [
      {
        question: "Posso usar este recibo para pagamento de salário?",
        answer:
          "Este modelo serve para pagamentos avulsos ou de prestação de serviço. Para folha de pagamento formal (CLT), utilize o holerite exigido pela legislação trabalhista.",
      },
    ],
    seoTitle: "Recibo de Pagamento Grátis — Gere em Minutos",
    seoDescription:
      "Gere um recibo de pagamento profissional em PDF, pronto para assinar.",
    fieldsSchema: [
      {
        key: "recebedorNome",
        label: "Nome de quem recebe",
        type: "text",
        required: true,
      },
      { key: "recebedorCpf", label: "CPF de quem recebe", type: "cpf", required: true },
      { key: "pagadorNome", label: "Nome de quem paga", type: "text", required: true },
      {
        key: "pagadorCpf",
        label: "CPF/CNPJ de quem paga",
        type: "cpfCnpj",
        required: true,
      },
      { key: "valor", label: "Valor pago", type: "currency", required: true },
      {
        key: "referenciaPeriodo",
        label: "Referente ao período",
        type: "text",
        required: true,
        placeholder: "Ex: serviços prestados em junho/2026",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "RECIBO DE PAGAMENTO" },
        {
          type: "paragraph",
          text: "Recebi de {{pagadorNome}}, CPF/CNPJ nº {{pagadorCpf}}, a quantia de {{valor}}, referente a {{referenciaPeriodo}}.",
        },
        {
          type: "paragraph",
          text: "Para maior clareza, firmo o presente recibo, dando plena, geral e irrevogável quitação, para nada mais reclamar em qualquer tempo.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        {
          type: "signature",
          text: "{{recebedorNome}}",
          signatureLabel: "CPF: {{recebedorCpf}}",
        },
      ],
    },
  },
  {
    name: "Recibo de Aluguel",
    slug: "recibo-aluguel",
    categorySlug: "imoveis",
    description:
      "Comprove o recebimento do pagamento do aluguel de um imóvel referente a um mês específico.",
    whenToUse:
      "Use todo mês ao receber o pagamento do aluguel, para que o locatário tenha comprovante do pagamento realizado.",
    howToUse:
      "Informe locador, locatário, endereço do imóvel, valor e mês de referência. Gere o PDF e assine ao receber o pagamento.",
    faq: [
      {
        question: "Preciso emitir um recibo por mês?",
        answer:
          "Sim, recomenda-se emitir um recibo a cada pagamento mensal, guardando uma cópia para o locador e outra para o locatário.",
      },
    ],
    seoTitle: "Recibo de Aluguel Grátis — Gere em Minutos",
    seoDescription: "Gere um recibo de aluguel profissional em PDF, pronto para assinar.",
    fieldsSchema: [
      { key: "locadorNome", label: "Nome do locador", type: "text", required: true },
      { key: "locadorCpf", label: "CPF do locador", type: "cpf", required: true },
      { key: "locatarioNome", label: "Nome do locatário", type: "text", required: true },
      { key: "locatarioCpf", label: "CPF do locatário", type: "cpf", required: true },
      {
        key: "enderecoImovel",
        label: "Endereço do imóvel",
        type: "text",
        required: true,
      },
      { key: "valor", label: "Valor do aluguel", type: "currency", required: true },
      {
        key: "mesReferencia",
        label: "Mês de referência",
        type: "text",
        required: true,
        placeholder: "Ex: julho/2026",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "RECIBO DE ALUGUEL" },
        {
          type: "paragraph",
          text: "Eu, {{locadorNome}}, portador(a) do CPF nº {{locadorCpf}}, recebi de {{locatarioNome}}, portador(a) do CPF nº {{locatarioCpf}}, a quantia de {{valor}}, referente ao aluguel do imóvel situado em {{enderecoImovel}}, correspondente ao mês de {{mesReferencia}}.",
        },
        {
          type: "paragraph",
          text: "Para maior clareza, firmo o presente recibo, dando plena e geral quitação referente ao período mencionado.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{locadorNome}}", signatureLabel: "LOCADOR" },
      ],
    },
  },
  {
    name: "Contrato de Compra e Venda",
    slug: "contrato-compra-venda",
    categorySlug: "contratos",
    description:
      "Formalize a compra e venda de um bem entre vendedor e comprador, com descrição do bem, valor e forma de pagamento.",
    whenToUse:
      "Use antes de vender ou comprar um bem de valor entre particulares, para registrar o que foi negociado.",
    howToUse:
      "Preencha os dados das duas partes, descreva o bem vendido, o valor e a forma de pagamento. Gere o PDF e colete a assinatura de ambas as partes.",
    faq: [
      {
        question: "Este contrato serve para veículos e imóveis?",
        answer:
          "Serve como contrato particular para bens móveis em geral. Para imóveis e veículos, verifique se há exigências adicionais de registro (cartório ou DETRAN).",
      },
    ],
    seoTitle: "Contrato de Compra e Venda Grátis — Gere em Minutos",
    seoDescription:
      "Gere um contrato de compra e venda profissional em PDF, com cláusulas essenciais já organizadas.",
    fieldsSchema: [
      { key: "vendedorNome", label: "Nome do vendedor", type: "text", required: true },
      { key: "vendedorCpf", label: "CPF do vendedor", type: "cpf", required: true },
      {
        key: "vendedorEndereco",
        label: "Endereço do vendedor",
        type: "text",
        required: true,
      },
      { key: "compradorNome", label: "Nome do comprador", type: "text", required: true },
      { key: "compradorCpf", label: "CPF do comprador", type: "cpf", required: true },
      {
        key: "compradorEndereco",
        label: "Endereço do comprador",
        type: "text",
        required: true,
      },
      {
        key: "descricaoBem",
        label: "Descrição do bem vendido",
        type: "textarea",
        required: true,
      },
      { key: "valor", label: "Valor da venda", type: "currency", required: true },
      {
        key: "formaPagamento",
        label: "Forma de pagamento",
        type: "text",
        required: true,
        placeholder: "Ex: à vista via transferência bancária",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "CONTRATO DE COMPRA E VENDA" },
        {
          type: "paragraph",
          text: "De um lado, {{vendedorNome}}, portador(a) do CPF nº {{vendedorCpf}}, residente em {{vendedorEndereco}}, doravante denominado(a) VENDEDOR(A), e de outro lado {{compradorNome}}, portador(a) do CPF nº {{compradorCpf}}, residente em {{compradorEndereco}}, doravante denominado(a) COMPRADOR(A), firmam o presente contrato mediante as cláusulas a seguir.",
        },
        { type: "subtitle", text: "CLÁUSULA 1ª — DO OBJETO" },
        { type: "paragraph", text: "{{descricaoBem}}" },
        { type: "subtitle", text: "CLÁUSULA 2ª — DO VALOR E FORMA DE PAGAMENTO" },
        {
          type: "paragraph",
          text: "O COMPRADOR pagará ao VENDEDOR o valor de {{valor}}, {{formaPagamento}}.",
        },
        { type: "subtitle", text: "CLÁUSULA 3ª — DA ENTREGA" },
        {
          type: "paragraph",
          text: "O bem será entregue ao COMPRADOR no ato da assinatura deste contrato, em perfeitas condições de uso e conservação.",
        },
        { type: "subtitle", text: "CLÁUSULA 4ª — DAS DISPOSIÇÕES GERAIS" },
        {
          type: "paragraph",
          text: "As partes elegem o foro da comarca de {{cidade}} para dirimir quaisquer dúvidas oriundas deste contrato.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{vendedorNome}}", signatureLabel: "VENDEDOR(A)" },
        { type: "signature", text: "{{compradorNome}}", signatureLabel: "COMPRADOR(A)" },
      ],
    },
  },
  {
    name: "Contrato de Locação Simples",
    slug: "contrato-locacao-simples",
    categorySlug: "imoveis",
    description:
      "Formalize a locação de um imóvel entre locador e locatário, com prazo, valor do aluguel e obrigações das partes.",
    whenToUse:
      "Use ao alugar um imóvel residencial de forma simples, sem necessidade de fiador ou cláusulas complexas.",
    howToUse:
      "Preencha os dados das duas partes, o endereço do imóvel, valor do aluguel, dia de vencimento e prazo do contrato. Gere o PDF e colete as assinaturas.",
    faq: [
      {
        question: "Este contrato precisa de fiador?",
        answer:
          "O modelo básico não inclui cláusula de fiador. Caso deseje incluir garantias adicionais, recomenda-se consultoria jurídica específica.",
      },
    ],
    seoTitle: "Contrato de Locação Simples Grátis — Gere em Minutos",
    seoDescription:
      "Gere um contrato de locação residencial simples em PDF, pronto para assinar.",
    fieldsSchema: [
      { key: "locadorNome", label: "Nome do locador", type: "text", required: true },
      { key: "locadorCpf", label: "CPF do locador", type: "cpf", required: true },
      { key: "locatarioNome", label: "Nome do locatário", type: "text", required: true },
      { key: "locatarioCpf", label: "CPF do locatário", type: "cpf", required: true },
      {
        key: "enderecoImovel",
        label: "Endereço do imóvel",
        type: "text",
        required: true,
      },
      {
        key: "valorAluguel",
        label: "Valor mensal do aluguel",
        type: "currency",
        required: true,
      },
      {
        key: "diaVencimento",
        label: "Dia de vencimento",
        type: "text",
        required: true,
        placeholder: "Ex: dia 5 de cada mês",
      },
      {
        key: "prazoContrato",
        label: "Prazo do contrato",
        type: "text",
        required: true,
        placeholder: "Ex: 12 meses",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "CONTRATO DE LOCAÇÃO" },
        {
          type: "paragraph",
          text: "De um lado, {{locadorNome}}, portador(a) do CPF nº {{locadorCpf}}, doravante denominado(a) LOCADOR(A), e de outro lado {{locatarioNome}}, portador(a) do CPF nº {{locatarioCpf}}, doravante denominado(a) LOCATÁRIO(A), firmam o presente contrato de locação mediante as cláusulas a seguir.",
        },
        { type: "subtitle", text: "CLÁUSULA 1ª — DO IMÓVEL" },
        {
          type: "paragraph",
          text: "O presente contrato tem por objeto o imóvel situado em {{enderecoImovel}}.",
        },
        { type: "subtitle", text: "CLÁUSULA 2ª — DO PRAZO" },
        {
          type: "paragraph",
          text: "O prazo de locação é de {{prazoContrato}}, contado a partir da assinatura deste contrato.",
        },
        { type: "subtitle", text: "CLÁUSULA 3ª — DO ALUGUEL" },
        {
          type: "paragraph",
          text: "O valor mensal do aluguel é de {{valorAluguel}}, com vencimento {{diaVencimento}}.",
        },
        { type: "subtitle", text: "CLÁUSULA 4ª — DAS OBRIGAÇÕES" },
        {
          type: "paragraph",
          text: "O LOCATÁRIO se compromete a conservar o imóvel e devolvê-lo nas mesmas condições em que o recebeu, ressalvado o desgaste natural de uso.",
        },
        { type: "subtitle", text: "CLÁUSULA 5ª — DAS DISPOSIÇÕES GERAIS" },
        {
          type: "paragraph",
          text: "As partes elegem o foro da comarca de {{cidade}} para dirimir quaisquer dúvidas oriundas deste contrato.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{locadorNome}}", signatureLabel: "LOCADOR(A)" },
        { type: "signature", text: "{{locatarioNome}}", signatureLabel: "LOCATÁRIO(A)" },
      ],
    },
  },
  {
    name: "Orçamento",
    slug: "orcamento",
    categorySlug: "empresas",
    description:
      "Envie um orçamento profissional para um cliente, com descrição do serviço, valor e prazo de validade.",
    whenToUse:
      "Use antes de fechar um serviço com um cliente, para apresentar uma proposta clara de valores e prazos.",
    howToUse:
      "Informe os dados da sua empresa, do cliente, a descrição do serviço e o valor. Gere o PDF e envie ao cliente.",
    faq: [
      {
        question: "O orçamento tem valor de contrato?",
        answer:
          "Não. O orçamento é uma proposta comercial; para formalizar o compromisso, recomenda-se gerar um contrato de prestação de serviço após a aprovação.",
      },
    ],
    seoTitle: "Orçamento Profissional Grátis — Gere em Minutos",
    seoDescription:
      "Gere um orçamento profissional em PDF para enviar aos seus clientes.",
    fieldsSchema: [
      {
        key: "empresaNome",
        label: "Nome da empresa ou profissional",
        type: "text",
        required: true,
      },
      { key: "empresaDocumento", label: "CPF ou CNPJ", type: "cpfCnpj", required: true },
      { key: "clienteNome", label: "Nome do cliente", type: "text", required: true },
      {
        key: "descricaoServico",
        label: "Descrição do serviço ou produto",
        type: "textarea",
        required: true,
      },
      { key: "valor", label: "Valor total", type: "currency", required: true },
      {
        key: "validadeOrcamento",
        label: "Validade do orçamento",
        type: "text",
        required: true,
        placeholder: "Ex: 15 dias",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "ORÇAMENTO" },
        {
          type: "paragraph",
          text: "Orçamento elaborado por {{empresaNome}} (CPF/CNPJ nº {{empresaDocumento}}) para {{clienteNome}}.",
        },
        { type: "fieldLine", text: "Descrição: {{descricaoServico}}" },
        { type: "fieldLine", text: "Valor total: {{valor}}" },
        {
          type: "paragraph",
          text: "Este orçamento tem validade de {{validadeOrcamento}} a partir da data de emissão.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{empresaNome}}" },
      ],
    },
  },
  {
    name: "Ordem de Serviço",
    slug: "ordem-servico",
    categorySlug: "empresas",
    description:
      "Registre formalmente um serviço a ser executado, com descrição, materiais utilizados, valor e prazo de execução.",
    whenToUse:
      "Use ao iniciar a execução de um serviço, para registrar o que foi combinado e servir de controle interno ou comprovante ao cliente.",
    howToUse:
      "Descreva o serviço a ser executado, materiais envolvidos, valor e prazo. Gere o PDF para controle interno ou entrega ao cliente.",
    faq: [
      {
        question: "Ordem de serviço substitui contrato?",
        answer:
          "Para serviços simples e pontuais, a ordem de serviço é suficiente. Para serviços mais complexos, recomenda-se um contrato de prestação de serviço.",
      },
    ],
    seoTitle: "Ordem de Serviço Grátis — Gere em Minutos",
    seoDescription: "Gere uma ordem de serviço profissional em PDF.",
    fieldsSchema: [
      {
        key: "empresaNome",
        label: "Nome da empresa ou profissional",
        type: "text",
        required: true,
      },
      { key: "clienteNome", label: "Nome do cliente", type: "text", required: true },
      {
        key: "descricaoServico",
        label: "Descrição do serviço",
        type: "textarea",
        required: true,
      },
      {
        key: "materiaisUtilizados",
        label: "Materiais/peças utilizados",
        type: "textarea",
        required: true,
      },
      { key: "valor", label: "Valor total", type: "currency", required: true },
      {
        key: "prazoExecucao",
        label: "Prazo de execução",
        type: "text",
        required: true,
        placeholder: "Ex: 5 dias úteis",
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "ORDEM DE SERVIÇO" },
        {
          type: "paragraph",
          text: "Prestador: {{empresaNome}}. Cliente: {{clienteNome}}.",
        },
        { type: "subtitle", text: "DESCRIÇÃO DO SERVIÇO" },
        { type: "paragraph", text: "{{descricaoServico}}" },
        { type: "subtitle", text: "MATERIAIS E PEÇAS UTILIZADOS" },
        { type: "paragraph", text: "{{materiaisUtilizados}}" },
        { type: "subtitle", text: "VALOR E PRAZO" },
        {
          type: "paragraph",
          text: "Valor total de {{valor}}, com prazo de execução de {{prazoExecucao}}.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{empresaNome}}", signatureLabel: "PRESTADOR" },
        { type: "signature", text: "{{clienteNome}}", signatureLabel: "CLIENTE" },
      ],
    },
  },
  {
    name: "Autorização para Viagem de Menor",
    slug: "autorizacao-viagem-menor",
    categorySlug: "familia",
    description:
      "Autorize a viagem de um menor de idade acompanhado de terceiros, com destino, período e responsável indicados.",
    whenToUse:
      "Use quando uma criança ou adolescente for viajar acompanhado(a) de terceiros ou de apenas um dos responsáveis legais.",
    howToUse:
      "Informe seus dados como responsável legal, os dados do menor, destino, período da viagem e quem irá acompanhá-lo. Gere o PDF e assine.",
    faq: [
      {
        question: "Essa autorização precisa de reconhecimento de firma?",
        answer:
          "Para viagens nacionais desacompanhadas dos pais, muitas companhias exigem reconhecimento de firma. Para viagens internacionais, pode ser exigida autorização judicial ou consular específica — verifique as regras vigentes antes de viajar.",
      },
    ],
    seoTitle: "Autorização de Viagem de Menor Grátis — Gere em Minutos",
    seoDescription:
      "Gere uma autorização de viagem de menor em PDF, pronta para assinar.",
    fieldsSchema: [
      {
        key: "responsavelNome",
        label: "Nome do(a) responsável legal",
        type: "text",
        required: true,
      },
      {
        key: "responsavelCpf",
        label: "CPF do(a) responsável legal",
        type: "cpf",
        required: true,
      },
      { key: "menorNome", label: "Nome do(a) menor", type: "text", required: true },
      {
        key: "menorDataNascimento",
        label: "Data de nascimento do(a) menor",
        type: "date",
        required: true,
      },
      { key: "destinoViagem", label: "Destino da viagem", type: "text", required: true },
      {
        key: "periodoViagem",
        label: "Período da viagem",
        type: "text",
        required: true,
        placeholder: "Ex: 10/07/2026 a 20/07/2026",
      },
      {
        key: "acompanhanteNome",
        label: "Nome do(a) acompanhante",
        type: "text",
        required: true,
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "AUTORIZAÇÃO DE VIAGEM DE MENOR" },
        {
          type: "paragraph",
          text: "Eu, {{responsavelNome}}, portador(a) do CPF nº {{responsavelCpf}}, na qualidade de responsável legal pelo(a) menor {{menorNome}}, nascido(a) em {{menorDataNascimento}}, autorizo que o(a) mesmo(a) viaje para {{destinoViagem}}, no período de {{periodoViagem}}, acompanhado(a) de {{acompanhanteNome}}.",
        },
        {
          type: "paragraph",
          text: "Declaro estar ciente das disposições do Estatuto da Criança e do Adolescente (ECA) aplicáveis a esta autorização.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        {
          type: "signature",
          text: "{{responsavelNome}}",
          signatureLabel: "Responsável Legal",
        },
      ],
    },
  },
  {
    name: "Carta de Solicitação",
    slug: "carta-solicitacao",
    categorySlug: "trabalho",
    description:
      "Formalize um pedido ou solicitação a uma empresa, instituição ou setor específico, de forma clara e objetiva.",
    whenToUse:
      "Use sempre que precisar formalizar um pedido a uma empresa, escola ou órgão público de forma escrita e organizada.",
    howToUse:
      "Informe o destinatário, o assunto e descreva sua solicitação. Gere o PDF e entregue ou envie ao destinatário.",
    faq: [
      {
        question: "Posso usar para qualquer tipo de solicitação?",
        answer:
          "Sim, o modelo é genérico e pode ser adaptado para solicitações a empresas, escolas, órgãos públicos ou qualquer instituição.",
      },
    ],
    seoTitle: "Carta de Solicitação Grátis — Gere em Minutos",
    seoDescription: "Gere uma carta de solicitação formal em PDF.",
    fieldsSchema: [
      { key: "remetenteNome", label: "Seu nome", type: "text", required: true },
      {
        key: "destinatarioNome",
        label: "Destinatário",
        type: "text",
        required: true,
        placeholder: "Ex: Setor de Recursos Humanos",
      },
      { key: "assunto", label: "Assunto", type: "text", required: true },
      {
        key: "corpoSolicitacao",
        label: "Descreva sua solicitação",
        type: "textarea",
        required: true,
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "CARTA DE SOLICITAÇÃO" },
        { type: "fieldLine", text: "Assunto: {{assunto}}" },
        { type: "spacer" },
        { type: "paragraph", text: "Prezado(a) {{destinatarioNome}}," },
        { type: "paragraph", text: "{{corpoSolicitacao}}" },
        { type: "paragraph", text: "Agradeço desde já a atenção dispensada." },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{remetenteNome}}" },
      ],
    },
  },
  {
    name: "Termo de Responsabilidade",
    slug: "termo-responsabilidade",
    categorySlug: "pessoal",
    description:
      "Assuma formalmente a responsabilidade por um bem, ato ou situação específica, isentando terceiros de eventuais consequências.",
    whenToUse:
      "Use quando precisar formalizar por escrito que assume a responsabilidade por um bem, uma pessoa ou uma situação específica.",
    howToUse:
      "Descreva claramente pelo que está se responsabilizando. Gere o PDF e assine antes de entregar.",
    faq: [
      {
        question: "Esse termo pode ser usado para retirada de menores na escola?",
        answer:
          "Sim, é um dos usos comuns — adapte a descrição da responsabilidade para o caso específico, como autorização de retirada por terceiros.",
      },
    ],
    seoTitle: "Termo de Responsabilidade Grátis — Gere em Minutos",
    seoDescription: "Gere um termo de responsabilidade em PDF, pronto para assinar.",
    fieldsSchema: [
      { key: "nome", label: "Nome completo", type: "text", required: true },
      { key: "cpf", label: "CPF", type: "cpf", required: true },
      {
        key: "objetoResponsabilidade",
        label: "Pelo que você está se responsabilizando",
        type: "textarea",
        required: true,
      },
      { key: "cidade", label: "Cidade", type: "text", required: true },
      { key: "data", label: "Data", type: "date", required: true },
    ],
    contentSchema: {
      blocks: [
        { type: "title", text: "TERMO DE RESPONSABILIDADE" },
        {
          type: "paragraph",
          text: "Eu, {{nome}}, portador(a) do CPF nº {{cpf}}, assumo total responsabilidade por: {{objetoResponsabilidade}}.",
        },
        {
          type: "paragraph",
          text: "Declaro estar ciente das obrigações e eventuais consequências decorrentes deste termo, isentando terceiros de responsabilidade sobre o mencionado acima.",
        },
        { type: "spacer" },
        { type: "paragraph", align: "center", text: "{{cidade}}, {{data}}." },
        { type: "spacer" },
        { type: "signature", text: "{{nome}}" },
      ],
    },
  },
]

async function main() {
  console.log("Seeding planos...")
  await prisma.plan.upsert({
    where: { slug: "gratuito" },
    update: {},
    create: {
      name: "Gratuito",
      slug: "gratuito",
      priceCents: 0,
      interval: PlanInterval.FREE,
      documentLimitPerMonth: 5,
      watermark: true,
      features: ["5 documentos por mês", "Marca d'água no PDF"],
    },
  })
  await prisma.plan.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      name: "Premium",
      slug: "premium",
      priceCents: 2990,
      interval: PlanInterval.MONTHLY,
      documentLimitPerMonth: null,
      watermark: false,
      features: [
        "Documentos ilimitados",
        "Sem marca d'água",
        "Histórico completo",
        "Favoritos",
        "Download ilimitado",
      ],
    },
  })

  console.log("Seeding categorias...")
  const categoryIdBySlug = new Map<string, string>()
  for (const category of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    categoryIdBySlug.set(category.slug, created.id)
  }

  console.log("Seeding templates...")
  for (const tmpl of TEMPLATES) {
    const categoryId = categoryIdBySlug.get(tmpl.categorySlug)
    if (!categoryId) throw new Error(`Categoria não encontrada: ${tmpl.categorySlug}`)

    const template = await prisma.documentTemplate.upsert({
      where: { slug: tmpl.slug },
      update: {
        name: tmpl.name,
        categoryId,
        description: tmpl.description,
        whenToUse: tmpl.whenToUse,
        howToUse: tmpl.howToUse,
        faq: tmpl.faq,
        seoTitle: tmpl.seoTitle,
        seoDescription: tmpl.seoDescription,
      },
      create: {
        name: tmpl.name,
        slug: tmpl.slug,
        categoryId,
        description: tmpl.description,
        whenToUse: tmpl.whenToUse,
        howToUse: tmpl.howToUse,
        faq: tmpl.faq,
        seoTitle: tmpl.seoTitle,
        seoDescription: tmpl.seoDescription,
        status: TemplateStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })

    const existingVersion = await prisma.documentTemplateVersion.findUnique({
      where: { templateId_version: { templateId: template.id, version: 1 } },
    })

    const version =
      existingVersion ??
      (await prisma.documentTemplateVersion.create({
        data: {
          templateId: template.id,
          version: 1,
          fieldsSchema: tmpl.fieldsSchema as unknown as Prisma.InputJsonValue,
          contentSchema: tmpl.contentSchema as unknown as Prisma.InputJsonValue,
          changelog: "Versão inicial",
        },
      }))

    if (template.activeVersionId !== version.id) {
      await prisma.documentTemplate.update({
        where: { id: template.id },
        data: { activeVersionId: version.id },
      })
    }
  }

  console.log("Seed concluído.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
