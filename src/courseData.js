const makeQuiz = (lessonId, quiz) =>
  quiz.map((item, index) => ({
    ...item,
    id: `${lessonId}-q${index + 1}`,
  }));

const lesson = (config) => ({
  xp: 80,
  steps: [],
  concepts: [],
  ...config,
  quiz: makeQuiz(config.id, config.quiz),
});

export const courseModules = [
  {
    id: "foundations",
    title: "Base da L?gica",
    level: "Iniciante",
    accent: "sunrise",
    summary: "Aqui a pessoa aprende a pensar como programadora antes de pensar em sintaxe.",
    outcome: "Sair sabendo quebrar problemas, escrever passos e revisar o proprio racioc?nio.",
    lessons: [
      lesson({
        id: "computational-thinking",
        title: "Pensamento computacional",
        time: "7 min",
        difficulty: "Nivel 1",
        objective: "Entender que programa??o e transformar problemas em etapas claras e execut?veis.",
        reading: [
          "Toda pessoa desenvolvedora forte comeca observando bem o problema. Antes de escolher linguagem ou framework, ela entende o que entra, o que precisa acontecer e qual sa?da o sistema deve entregar.",
          "Pensamento computacional e a habilidade de decompor um desafio grande em partes pequenas, previsiveis e testaveis. Isso reduz ansiedade e aumenta controle sobre a solucao.",
        ],
        concepts: ["Entrada, processamento e sa?da", "Decomposicao", "Passos sem ambiguidade"],
        steps: [
          {
            title: "Observe o problema",
            body: "Defina com precisao o que precisa ser resolvido antes de tentar codar qualquer coisa.",
          },
          {
            title: "Quebre em blocos",
            body: "Separe o problema em pequenas a??es que uma maquina conseguiria seguir.",
          },
          {
            title: "Pense em resultado",
            body: "Todo fluxo precisa deixar claro o que entra e qual sa?da final sera produzida.",
          },
        ],
        example: {
          label: "Fluxo de racioc?nio",
          code: [
            "Objetivo: recomendar um filme",
            "1. Receber genero favorito",
            "2. Verificar idade da pessoa",
            "3. Filtrar opcoes disponiveis",
            "4. Mostrar melhor sugestao",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Descreva em quatro passos como um app recebe um nome e responde com uma saudacao.",
          expected: "A resposta ideal separa entrada, processamento e sa?da sem pular etapas.",
          pitfalls: ["Tentar escrever c?digo cedo demais", "Esquecer qual e o resultado esperado"],
        },
        quiz: [
          {
            question: "Qual e a melhor primeira atitude diante de um problema novo?",
            options: [
              "Quebrar o problema em etapas menores",
              "Memorizar comandos aleatorios",
              "Escolher logo um framework",
              "Desenhar a tela antes da regra",
            ],
            answer: 0,
            explanation: "Separar em etapas pequenas torna o problema mais previsivel e controlavel.",
          },
          {
            question: "Entrada, processamento e sa?da formam:",
            options: [
              "Uma estrutura mental para montar solucoes",
              "Um tipo de banco de dados",
              "Um estilo visual de interface",
              "Uma linguagem de programa??o",
            ],
            answer: 0,
            explanation: "Esse trio ajuda a organizar qualquer rotina de l?gica.",
          },
        ],
      }),
      lesson({
        id: "sequence-and-steps",
        title: "Sequencia e ordem das a??es",
        time: "8 min",
        difficulty: "Nivel 2",
        objective: "Perceber que a ordem das instrucoes altera completamente o resultado.",
        reading: [
          "Computadores seguem instrucoes na ordem em que foram definidas. Se a ordem estiver errada, o sistema pode falhar mesmo quando cada passo isolado parece correto.",
          "Muita l?gica boa nasce de uma pergunta simples: o que deve acontecer primeiro, depois e por ultimo? Sequencia e a espinha dorsal de qualquer algoritmo.",
        ],
        concepts: ["Ordem importa", "Dependencia entre etapas", "Algoritmo sequencial"],
        steps: [
          {
            title: "Ache dependencias",
            body: "Antes de executar algo, veja se esse passo depende de outro ter acontecido antes.",
          },
          {
            title: "Evite saltos",
            body: "N?o pule etapas invisiveis no seu racioc?nio. Se o computador precisa saber, a instrucao deve existir.",
          },
          {
            title: "Valide a ordem",
            body: "Releia seu fluxo do inicio ao fim para ver se ele funciona de verdade.",
          },
        ],
        example: {
          label: "Comparando ordens",
          code: [
            "Errado:",
            "1. Mostrar total da compra",
            "2. Somar itens do carrinho",
            "",
            "Certo:",
            "1. Somar itens do carrinho",
            "2. Mostrar total da compra",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Organize o fluxo de login: receber email, validar campos, verificar senha, liberar acesso.",
          expected: "A ordem correta valida antes de liberar qualquer acesso.",
          pitfalls: ["Liberar acesso cedo demais", "Esquecer valida??o dos campos"],
        },
        quiz: [
          {
            question: "Por que a ordem das instrucoes importa?",
            options: [
              "Porque um passo pode depender do anterior",
              "Porque deixa o c?digo mais colorido",
              "Porque troca a linguagem usada",
              "Porque reduz a memoria sempre",
            ],
            answer: 0,
            explanation: "Sem a ordem certa, o fluxo pode tentar usar informa??es ainda inexistentes.",
          },
          {
            question: "Um algoritmo sequencial e:",
            options: [
              "Um conjunto de passos executados em ordem",
              "Uma lista de imagens",
              "Um banco de dados relacional",
              "Um tema do editor",
            ],
            answer: 0,
            explanation: "Algoritmo e justamente a descricao ordenada de uma solucao.",
          },
        ],
      }),
      lesson({
        id: "pseudocode",
        title: "Pseudocodigo sem medo",
        time: "8 min",
        difficulty: "Nivel 3",
        objective: "Escrever l?gica em linguagem humana estruturada antes de migrar para c?digo real.",
        reading: [
          "Pseudocodigo e uma ponte entre ideia e implementacao. Ele ajuda a validar a l?gica sem a pressao da sintaxe de uma linguagem especifica.",
          "Quem sabe montar pseudocodigo claro aprende linguagens mais rapido, porque a parte dif?cil da programa??o n?o e digitar comandos, e pensar bem.",
        ],
        concepts: ["Descricao estruturada", "Foco na l?gica", "Transi??o para c?digo real"],
        steps: [
          {
            title: "Use verbos claros",
            body: "Escreva instrucoes como receber, validar, calcular e mostrar.",
          },
          {
            title: "Mantenha consistencia",
            body: "Se voce comeca um estilo de escrita, mantenha o mesmo padrao no restante do fluxo.",
          },
          {
            title: "Leia em voz alta",
            body: "Se a explica??o parecer estranha para humanos, provavelmente tambem esta ruim para o c?digo.",
          },
        ],
        example: {
          label: "Pseudocodigo",
          code: [
            "receber nota1",
            "receber nota2",
            "media <- (nota1 + nota2) / 2",
            "mostrar media",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Escreva um pseudocodigo para calcular a idade de uma pessoa a partir do ano atual e do ano de nascimento.",
          expected: "A sequencia precisa receber dados, calcular a diferenca e exibir o resultado.",
          pitfalls: ["Misturar sintaxe de varias linguagens", "Esquecer a exibicao final"],
        },
        quiz: [
          {
            question: "Qual e a maior vantagem do pseudocodigo?",
            options: [
              "Validar a l?gica antes da sintaxe",
              "Substituir qualquer linguagem de vez",
              "Aumentar a velocidade da internet",
              "Evitar qualquer tipo de teste",
            ],
            answer: 0,
            explanation: "Pseudocodigo serve para pensar com clareza antes de codar.",
          },
          {
            question: "Um bom pseudocodigo deve ser:",
            options: [
              "Claro e consistente",
              "Cheio de abreviacoes obscuras",
              "Escrito com varias linguagens misturadas",
              "Sem verbos de a??o",
            ],
            answer: 0,
            explanation: "Clareza e consistencia facilitam a traducao para c?digo real.",
          },
        ],
      }),
      lesson({
        id: "dry-run",
        title: "Dry run e rastreio manual",
        time: "9 min",
        difficulty: "Nivel 4",
        objective: "Aprender a simular a execucao de uma l?gica para achar falhas cedo.",
        reading: [
          "Dry run e a t?cnica de executar um algoritmo manualmente, passo a passo, usando valores de exemplo. Ela ajuda a enxergar onde o racioc?nio quebra.",
          "Profissionais fazem isso o tempo todo quando leem um PR, depuram um bug ou revisam uma regra de negocio sensivel.",
        ],
        concepts: ["Simulacao manual", "Rastreamento de valores", "Deteccao antecipada de erro"],
        steps: [
          {
            title: "Escolha um exemplo",
            body: "Use valores reais ou plausiveis para testar o fluxo como se o usu?rio estivesse usando o sistema.",
          },
          {
            title: "Acompanhe variaveis",
            body: "Anote como cada valor muda depois de cada etapa.",
          },
          {
            title: "Compare com o esperado",
            body: "Veja se o resultado final bate com o comportamento desejado.",
          },
        ],
        example: {
          label: "Rastreio",
          code: [
            "idade <- 16",
            "podeDirigir <- idade >= 18",
            "Resultado esperado: falso",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Simule manualmente uma regra que soma dois numeros e divide por dois.",
          expected: "O foco e acompanhar os valores intermediarios e o resultado final.",
          pitfalls: ["Pular o calculo intermediario", "N?o comparar com o esperado"],
        },
        quiz: [
          {
            question: "Dry run ajuda principalmente a:",
            options: [
              "Simular a execucao e validar o racioc?nio",
              "Trocar o tema do editor",
              "Criar imagens para a interface",
              "Dispensar testes automatizados",
            ],
            answer: 0,
            explanation: "A simulacao manual revela erros antes da implementacao completa.",
          },
          {
            question: "Durante um dry run vale muito a pena:",
            options: [
              "Anotar como os valores mudam",
              "Ignorar resultados intermediarios",
              "Mudar tudo ao mesmo tempo",
              "Usar apenas casos perfeitos",
            ],
            answer: 0,
            explanation: "Rastrear valores e a forma mais segura de entender o fluxo.",
          },
        ],
      }),
    ],
  },
  {
    id: "data-basics",
    title: "Dados e Operacoes",
    level: "Base",
    accent: "ocean",
    summary: "Agora a trilha entra em armazenamento de informa??es, entrada, sa?da e opera??es.",
    outcome: "Sair capaz de guardar dados, receber informa??es e montar express?es corretas.",
    lessons: [
      lesson({
        id: "variables",
        title: "Variaveis com significado",
        time: "9 min",
        difficulty: "Nivel 5",
        objective: "Guardar dados com nomes claros e escolher representacoes coerentes.",
        reading: [
          "Variaveis sao caixas nomeadas usadas para armazenar valores que o programa precisa reutilizar. O nome escolhido deve revelar o papel desse dado no fluxo.",
          "Quem nomeia bem pensa melhor. Nomes claros diminuem bugs, aceleram revisao e facilitam colaboracao.",
        ],
        concepts: ["Armazenamento", "Nome semantico", "Atualizacao de valor"],
        steps: [
          {
            title: "Nomeie pela intencao",
            body: "Prefira totalDoPedido, idadeDoUsuario e emailPrincipal em vez de letras soltas.",
          },
          {
            title: "Guarde o que importa",
            body: "So crie variaveis quando elas realmente ajudam a expressar a regra.",
          },
          {
            title: "Revise a leitura",
            body: "Se o nome da variavel ja explica o dado, o c?digo fica mais autoexplicativo.",
          },
        ],
        example: {
          label: "Exemplo",
          code: ['nomeCliente <- "Maya"', "idadeCliente <- 28", "totalDoPedido <- 149.9"].join(
            "\n",
          ),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Renomeie as variaveis x, y e z para um fluxo de checkout.",
          expected: "Os nomes precisam mostrar que dado cada variavel guarda.",
          pitfalls: ["Usar abreviacoes confusas", "Ignorar o contexto de negocio"],
        },
        quiz: [
          {
            question: "Qual nome de variavel comunica melhor a intencao?",
            options: ["x", "valor", "precoFinal", "abc"],
            answer: 2,
            explanation: "precoFinal explica com clareza qual dado esta sendo guardado.",
          },
          {
            question: "Variaveis sao uteis porque:",
            options: [
              "Permitem guardar e reutilizar dados",
              "Substituem validacoes",
              "Apagam a necessidade de l?gica",
              "Trocam o idioma da linguagem",
            ],
            answer: 0,
            explanation: "Sem variaveis, ficaria muito mais dif?cil manter o estado do fluxo.",
          },
        ],
      }),
      lesson({
        id: "types",
        title: "Tipos de dados",
        time: "8 min",
        difficulty: "Nivel 6",
        objective: "Distinguir numeros, textos, booleanos e seus usos praticos.",
        reading: [
          "Tipos ajudam o sistema a interpretar cada valor corretamente. Um n?mero permite calculos, um texto representa palavras e um booleano responde perguntas com verdadeiro ou falso.",
          "Muitos bugs nascem quando tratamos um dado como se fosse de outro tipo. Pensar nisso cedo melhora a consistencia do programa.",
        ],
        concepts: ["Numero", "Texto", "Booleano"],
        steps: [
          {
            title: "Olhe a natureza do dado",
            body: "Idade normalmente e n?mero, nome e texto, permissao costuma ser booleano.",
          },
          {
            title: "Pense no uso",
            body: "O tipo correto depende do que voce quer fazer com o valor no fluxo.",
          },
          {
            title: "Evite misturas cegas",
            body: "Antes de operar, confira se os valores sao do tipo esperado.",
          },
        ],
        example: {
          label: "Tipos em uso",
          code: ['cidade <- "Recife"', "quantidade <- 12", "pagamentoAprovado <- verdadeiro"].join(
            "\n",
          ),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Classifique os dados email, notaFinal e planoAtivo nos tipos corretos.",
          expected: "Cada valor deve ser associado ao tipo mais apropriado para seu uso.",
          pitfalls: ["Tratar tudo como texto", "N?o pensar no comportamento esperado"],
        },
        quiz: [
          {
            question: "Qual valor combina com booleano?",
            options: ["42", '"Brasil"', "verdadeiro", "3.14"],
            answer: 2,
            explanation: "Booleanos representam estados logicos como verdadeiro e falso.",
          },
          {
            question: "Saber o tipo do dado ajuda a:",
            options: [
              "Evitar opera??es incoerentes",
              "Escolher cores para a UI",
              "Substituir a modelagem",
              "Eliminar qualquer teste",
            ],
            answer: 0,
            explanation: "O tipo correto orienta como aquele valor pode ser usado no programa.",
          },
        ],
      }),
      lesson({
        id: "input-output",
        title: "Entrada e sa?da de dados",
        time: "8 min",
        difficulty: "Nivel 7",
        objective: "Entender como o sistema recebe informa??es e responde ao usu?rio.",
        reading: [
          "Todo sistema conversa com alguma fonte de dados: formulario, API, teclado, banco ou outro servico. Essa parte e a entrada.",
          "Depois de processar algo, o sistema devolve uma resposta: mensagem, relatorio, tela atualizada, email ou resultado num?rico. Essa parte e a sa?da.",
        ],
        concepts: ["Coleta de dados", "Resposta do sistema", "Fluxo completo"],
        steps: [
          {
            title: "Mapeie a origem",
            body: "Saiba de onde o valor esta vindo para tratar a entrada corretamente.",
          },
          {
            title: "Processe com regra",
            body: "Entre a entrada e a sa?da existe a l?gica de negocio que decide o resultado.",
          },
          {
            title: "Entregue feedback",
            body: "A sa?da precisa ser clara para a pessoa usuaria e util para o sistema.",
          },
        ],
        example: {
          label: "Fluxo simples",
          code: [
            "receber nome",
            'mensagem <- "Ola, " + nome',
            "mostrar mensagem",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Descreva a entrada e a sa?da de um formulario de newsletter.",
          expected: "A resposta deve citar os campos recebidos e o retorno final ao usu?rio.",
          pitfalls: ["Falar so da interface", "Ignorar a confirmacao de cadastro"],
        },
        quiz: [
          {
            question: "Qual destas opcoes representa uma entrada?",
            options: [
              "Texto digitado em um formulario",
              "Mensagem exibida apos salvar",
              "Banner colorido na homepage",
              "Nome do projeto no repositotio",
            ],
            answer: 0,
            explanation: "Entrada e a informacao que chega ao sistema para ser processada.",
          },
          {
            question: "A sa?da de um sistema pode ser:",
            options: [
              "Uma resposta exibida apos o processamento",
              "Somente uma tela bonita",
              "A linguagem usada no backend",
              "Um comentario de c?digo",
            ],
            answer: 0,
            explanation: "Sa?da e tudo que o sistema entrega depois de tratar a entrada.",
          },
        ],
      }),
      lesson({
        id: "operators",
        title: "Operadores e express?es",
        time: "9 min",
        difficulty: "Nivel 8",
        objective: "Combinar valores para calcular, comparar e produzir resultados logicos.",
        reading: [
          "Operadores aritmeticos fazem contas, relacionais comparam valores e logicos conectam condi??es. Eles sao as pecas centrais de express?es mais ricas.",
          "Uma expressao e tudo que produz um valor no final. Esse valor pode ser n?mero, texto ou booleano, dependendo da combinacao usada.",
        ],
        concepts: ["Aritmetica", "Compara??o", "L?gica booleana"],
        steps: [
          {
            title: "Escolha o operador certo",
            body: "Use cada operador com intencao, de acordo com o resultado que voce precisa gerar.",
          },
          {
            title: "Leia a expressao inteira",
            body: "Entenda como as partes se conectam antes de confiar no resultado.",
          },
          {
            title: "Valide o retorno",
            body: "Pergunte se o valor final faz sentido para a regra de negocio.",
          },
        ],
        example: {
          label: "Expressao",
          code: [
            "idade <- 22",
            "temPlano <- verdadeiro",
            "podeEntrar <- idade >= 18 E temPlano",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Monte uma expressao que verifica se uma compra tem total maior que 100 e frete gratis.",
          expected: "A l?gica precisa combinar compara??o numerica e uma condi??o booleana.",
          pitfalls: ["Usar operador errado", "Misturar texto com n?mero sem pensar"],
        },
        quiz: [
          {
            question: "Qual operador conecta duas condi??es que precisam ser verdadeiras?",
            options: ["OU", "E", "+", "="],
            answer: 1,
            explanation: "O operador E exige que as duas partes sejam verdadeiras ao mesmo tempo.",
          },
          {
            question: "Uma expressao e:",
            options: [
              "Uma combinacao que produz um valor",
              "Somente um comentario",
              "A lista completa de arquivos",
              "Um layout de homepage",
            ],
            answer: 0,
            explanation: "Express?es servem para calcular ou avaliar algo e retornar um resultado.",
          },
        ],
      }),
    ],
  },
  {
    id: "decision-flow",
    title: "Decisao e Valida??o",
    level: "Basico",
    accent: "forest",
    summary: "Aqui o programa deixa de ser linear e passa a reagir a cenarios diferentes.",
    outcome: "Sair sabendo criar regras, validar dados e tratar estados reais do produto.",
    lessons: [
      lesson({
        id: "if-else",
        title: "Condicionais com if e else",
        time: "9 min",
        difficulty: "Nivel 9",
        objective: "Escolher caminhos diferentes com base em uma regra.",
        reading: [
          "Programas inteligentes n?o executam sempre o mesmo bloco. Eles verificam uma condi??o e tomam uma decisao a partir dela.",
          "If e else aparecem em login, desconto, autoriza??o, aprovacao, notificacao, mensagens de erro e praticamente todo produto real.",
        ],
        concepts: ["Tomada de decisao", "Fluxo alternativo", "Regra de negocio"],
        steps: [
          {
            title: "Formule a pergunta",
            body: "Toda condicional nasce de uma pergunta objetiva que pode ser respondida com sim ou n?o.",
          },
          {
            title: "Defina os caminhos",
            body: "Pense no que acontece se a resposta for verdadeira e no que acontece se for falsa.",
          },
          {
            title: "Escreva sem confundir",
            body: "Quando a condi??o fica clara, o fluxo fica mais facil de manter e revisar.",
          },
        ],
        example: {
          label: "Regra simples",
          code: [
            "se nota >= 7 entao",
            '  mostrar "Aprovado"',
            "senao",
            '  mostrar "Estudar mais"',
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Crie a regra para permitir acesso apenas a usu?rios com assinatura ativa.",
          expected: "A decisao precisa ter um caminho positivo e um caminho alternativo.",
          pitfalls: ["Esquecer o caso negativo", "Deixar a pergunta ambigua"],
        },
        quiz: [
          {
            question: "O bloco else executa quando:",
            options: [
              "A condi??o principal e falsa",
              "A condi??o principal e verdadeira",
              "O programa encerra",
              "N?o existem variaveis",
            ],
            answer: 0,
            explanation: "O else representa o caminho alternativo quando a condi??o n?o passa.",
          },
          {
            question: "Condicionais sao muito uteis para:",
            options: [
              "Tomar decisoes baseadas em regras",
              "Definir cor de teclado",
              "Criar repositorios automaticamente",
              "Substituir listas de dados",
            ],
            answer: 0,
            explanation: "A fun??o da condicional e direcionar o fluxo conforme a regra.",
          },
        ],
      }),
      lesson({
        id: "compound-rules",
        title: "Regras compostas",
        time: "10 min",
        difficulty: "Nivel 10",
        objective: "Combinar varias exigencias sem perder legibilidade.",
        reading: [
          "Projetos reais raramente dependem de uma unica regra. Normalmente temos idade, perfil, status, plano, permissao, horario ou disponibilidade se combinando ao mesmo tempo.",
          "A habilidade profissional aqui e montar condi??es fortes sem criar um bloco ilegivel. Quando a regra fica muito longa, variaveis auxiliares ajudam demais.",
        ],
        concepts: ["Condi??es compostas", "Variaveis auxiliares", "Legibilidade"],
        steps: [
          {
            title: "Quebre a regra longa",
            body: "Separe partes complexas em nomes intermediarios que explicam sua fun??o.",
          },
          {
            title: "Use E e OU com criterio",
            body: "Entenda bem se todas as condi??es precisam ser verdadeiras ou se basta uma delas.",
          },
          {
            title: "Leia como frase",
            body: "Se a regra n?o puder ser lida quase como portugues, simplifique.",
          },
        ],
        example: {
          label: "Regra legivel",
          code: [
            "idadeOk <- idade >= 18",
            'planoOk <- plano = "pro"',
            "acessoLiberado <- idadeOk E planoOk",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Monte a regra de acesso para um painel admin que exige cargo admin e conta ativa.",
          expected: "A solucao ideal deixa claro o papel de cada condi??o.",
          pitfalls: ["Juntar tudo em uma linha confusa", "Trocar E por OU sem perceber"],
        },
        quiz: [
          {
            question: "Quando separar uma regra longa em variaveis auxiliares ajuda?",
            options: [
              "Quando queremos melhorar leitura e manutencao",
              "Quando queremos esconder a regra",
              "Quando queremos eliminar testes",
              "Quando n?o existem condi??es",
            ],
            answer: 0,
            explanation: "Variaveis auxiliares deixam o fluxo mais claro e facil de revisar.",
          },
          {
            question: "No operador E, o resultado sera verdadeiro quando:",
            options: [
              "Todas as partes forem verdadeiras",
              "Apenas uma parte for verdadeira",
              "Nenhuma compara??o existir",
              "Houver qualquer texto na expressao",
            ],
            answer: 0,
            explanation: "O operador E exige satisfacao conjunta das condi??es.",
          },
        ],
      }),
      lesson({
        id: "validation",
        title: "Valida??o de dados",
        time: "10 min",
        difficulty: "Nivel 11",
        objective: "Impedir estados invalidos e guiar o usu?rio com mensagens claras.",
        reading: [
          "A maioria dos erros de produto nasce porque o sistema recebeu um valor faltando, fora do formato esperado ou incoerente com a regra de negocio.",
          "Validar e uma forma de proteger o sistema e tambem de educar o usu?rio, indicando exatamente o que precisa ser corrigido para o fluxo continuar.",
        ],
        concepts: ["Campos obrigatorios", "Formato esperado", "Mensagem de erro util"],
        steps: [
          {
            title: "Cheque obrigatoriedade",
            body: "Veja se todos os dados minimos chegaram antes de continuar.",
          },
          {
            title: "Cheque consistencia",
            body: "N?o basta receber algo; o valor precisa fazer sentido para a regra.",
          },
          {
            title: "Explique o erro",
            body: "Mensagens especificas ajudam o usu?rio a recuperar o fluxo rapido.",
          },
        ],
        example: {
          label: "Valida??o simples",
          code: [
            'se email = "" entao',
            '  mostrar "Informe seu email"',
            "senao",
            "  continuar cadastro",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Defina as validacoes minimas para um cadastro com nome, email e senha.",
          expected: "A resposta ideal cita obrigatoriedade, formato e criterio de senha.",
          pitfalls: ["Validar so um campo", "Mostrar erro generico demais"],
        },
        quiz: [
          {
            question: "Qual e o principal objetivo da valida??o?",
            options: [
              "Garantir dados confiaveis para o fluxo",
              "Deixar a tela mais bonita",
              "Reduzir a quantidade de variaveis",
              "Substituir modelagem de dados",
            ],
            answer: 0,
            explanation: "Valida??o protege a l?gica e evita estados quebrados.",
          },
          {
            question: "Qual mensagem orienta melhor a pessoa usuaria?",
            options: [
              "Informe um email valido",
              "Erro 42",
              "Falhou",
              "Tente de novo sem contexto",
            ],
            answer: 0,
            explanation: "Mensagem clara ajuda a corrigir o problema com rapidez.",
          },
        ],
      }),
      lesson({
        id: "states",
        title: "Erro, vazio e sucesso",
        time: "9 min",
        difficulty: "Nivel 12",
        objective: "Pensar como produto real tratando varios estados do fluxo.",
        reading: [
          "Muita gente iniciante pensa apenas no caminho perfeito. Mas sistemas profissionais tratam sucesso, erro, carregamento, vazio e permissao negada com o mesmo cuidado.",
          "Quando esses estados sao definidos cedo, a experiencia do usu?rio melhora e a implementacao fica mais previsivel para toda a equipe.",
        ],
        concepts: ["Estado de sucesso", "Estado de erro", "Estado vazio"],
        steps: [
          {
            title: "Desenhe o caminho ideal",
            body: "Comece entendendo o que deve acontecer quando tudo da certo.",
          },
          {
            title: "Liste excecoes reais",
            body: "Pense no que acontece quando n?o ha dados, quando falha a valida??o ou quando o acesso e negado.",
          },
          {
            title: "Defina resposta para cada estado",
            body: "Todo estado precisa de uma rea??o clara da interface e da l?gica.",
          },
        ],
        example: {
          label: "Estados do produto",
          code: [
            "se pedidoSalvo entao mostrar sucesso",
            "se pedidoFalhou entao mostrar erro",
            "se listaPedidos vazia entao mostrar estado vazio",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Liste os estados principais de uma tela de historico de pedidos.",
          expected: "A resposta deve incluir pelo menos carregamento, sucesso, erro e vazio.",
          pitfalls: ["Pensar so no sucesso", "N?o conectar estado e resposta visual"],
        },
        quiz: [
          {
            question: "Um estado vazio representa:",
            options: [
              "Quando n?o existem dados para exibir",
              "Quando o usu?rio sempre erra a senha",
              "Quando o app muda de cor",
              "Quando o backend foi apagado",
            ],
            answer: 0,
            explanation: "Estado vazio e diferente de erro; apenas n?o ha conte?do ainda.",
          },
          {
            question: "Pensar em varios estados melhora o produto porque:",
            options: [
              "Prepara o sistema para situacoes reais",
              "Elimina a necessidade de backend",
              "Substitui os testes",
              "Impede qualquer bug",
            ],
            answer: 0,
            explanation: "Produtos maduros tratam mais do que apenas o caminho ideal.",
          },
        ],
      }),
    ],
  },
  {
    id: "repetition-and-functions",
    title: "Repeticao e Modularizacao",
    level: "Intermediario",
    accent: "ember",
    summary: "A partir daqui voce automatiza tarefas e aprende a reaproveitar l?gica.",
    outcome: "Sair sabendo repetir, acumular, extrair fun??es e depurar com metodo.",
    lessons: [
      lesson({
        id: "loops",
        title: "Lacos de repeticao",
        time: "10 min",
        difficulty: "Nivel 13",
        objective: "Executar o mesmo comportamento varias vezes com controle.",
        reading: [
          "Repetir c?digo manualmente e um sinal de que a l?gica ainda n?o foi generalizada. Lacos resolvem isso permitindo iterar enquanto uma condi??o faz sentido.",
          "O ponto mais importante aqui n?o e decorar while ou for, e entender quando repetir, o que muda a cada volta e quando a repeticao deve parar.",
        ],
        concepts: ["Repeticao controlada", "Condi??o de parada", "Itera??o"],
        steps: [
          {
            title: "Defina o que se repete",
            body: "Descubra qual a??o precisa acontecer varias vezes sem copiar e colar.",
          },
          {
            title: "Acompanhe o progresso",
            body: "Use um contador ou outro criterio que mostre o avancar do laco.",
          },
          {
            title: "Garanta a parada",
            body: "Sem criterio de sa?da realista, o fluxo pode travar em loop infinito.",
          },
        ],
        example: {
          label: "While conceitual",
          code: [
            "contador <- 1",
            "enquanto contador <= 3 faca",
            "  mostrar contador",
            "  contador <- contador + 1",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Descreva como repetir a exibicao de cinco nomes de uma lista.",
          expected: "A resposta deve citar itera??o, acesso a cada item e parada.",
          pitfalls: ["Esquecer a atualizacao do contador", "N?o definir fim do laco"],
        },
        quiz: [
          {
            question: "O que evita um loop infinito?",
            options: [
              "Uma condi??o de parada atingivel",
              "Um nome curto de variavel",
              "Um comentario no c?digo",
              "Trocar de linguagem",
            ],
            answer: 0,
            explanation: "Sem sa?da realista, a repeticao n?o termina.",
          },
          {
            question: "Repeticao e util especialmente para:",
            options: [
              "Percorrer listas e colecoes",
              "Escolher um nome de projeto",
              "Criar uma paleta de cores",
              "Definir licenca do repositorio",
            ],
            answer: 0,
            explanation: "Lacos brilham quando ha conjuntos de dados ou tarefas repetitivas.",
          },
        ],
      }),
      lesson({
        id: "accumulators",
        title: "Acumuladores e contadores",
        time: "9 min",
        difficulty: "Nivel 14",
        objective: "Somar, contar e construir resultados progressivos ao longo de um laco.",
        reading: [
          "Muitos algoritmos usam repeticao n?o apenas para visitar itens, mas para construir um resultado final. E ai que entram acumuladores e contadores.",
          "Eles aparecem em totais de carrinho, n?mero de aprovados, media de notas, soma de vendas, quantidade de erros e muitas outras regras de negocio.",
        ],
        concepts: ["Soma progressiva", "Contagem", "Estado intermediario"],
        steps: [
          {
            title: "Comece pelo valor inicial",
            body: "Normalmente acumuladores e contadores iniciam em zero para refletir ausencia de resultado.",
          },
          {
            title: "Atualize a cada volta",
            body: "Cada itera??o deve alterar o estado conforme a regra desejada.",
          },
          {
            title: "Use o resultado final",
            body: "Depois do laco, o valor acumulado ja representa a resposta que o sistema procurava.",
          },
        ],
        example: {
          label: "Somando itens",
          code: [
            "total <- 0",
            "para cada valor em compras faca",
            "  total <- total + valor",
            "mostrar total",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Explique como contar quantos alunos tiraram nota maior que 7.",
          expected: "A resposta ideal usa um contador que cresce quando a condi??o e atendida.",
          pitfalls: ["Somar o valor da nota no lugar de contar", "Esquecer o valor inicial"],
        },
        quiz: [
          {
            question: "Um acumulador serve para:",
            options: [
              "Construir um valor ao longo da repeticao",
              "Escolher a linguagem do projeto",
              "Mudar o design do app",
              "Substituir testes",
            ],
            answer: 0,
            explanation: "Ele armazena o resultado parcial e final da regra repetitiva.",
          },
          {
            question: "Contadores normalmente comecam em zero porque:",
            options: [
              "Ainda n?o houve nenhum item contado",
              "Zero e sempre mais rapido",
              "Eh obrigacao da linguagem",
              "Evita qualquer bug sozinho",
            ],
            answer: 0,
            explanation: "O valor inicial representa o estado antes da itera??o acontecer.",
          },
        ],
      }),
      lesson({
        id: "functions",
        title: "Fun??es e parametros",
        time: "10 min",
        difficulty: "Nivel 15",
        objective: "Extrair comportamentos reutilizaveis e criar entradas claras para a regra.",
        reading: [
          "Fun??es permitem escrever uma regra uma vez e usa-la em varios pontos do sistema. Isso reduz duplicacao e torna o c?digo mais previsivel.",
          "Uma fun??o forte tem nome claro, responsabilidade focada, entradas coerentes e retorno confiavel. Essa combinacao aproxima seu c?digo do nivel profissional.",
        ],
        concepts: ["Reutilizacao", "Parametro", "Retorno"],
        steps: [
          {
            title: "Ache repeticoes",
            body: "Quando o mesmo comportamento aparece varias vezes, vale extrair para fun??o.",
          },
          {
            title: "Defina as entradas",
            body: "Os parametros representam os dados que a fun??o precisa para trabalhar.",
          },
          {
            title: "Prometa um retorno claro",
            body: "A pessoa que usa a fun??o deve saber exatamente o que ela devolve.",
          },
        ],
        example: {
          label: "Fun??o simples",
          code: [
            "fun??o dobrar(valor)",
            "  retornar valor * 2",
            "",
            "resultado <- dobrar(6)",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Desenhe uma fun??o que recebe preco e desconto e devolve o valor final.",
          expected: "A solucao deve explicitar parametros e resultado esperado.",
          pitfalls: ["Misturar varias responsabilidades", "N?o deixar o retorno claro"],
        },
        quiz: [
          {
            question: "A grande vantagem de uma fun??o e:",
            options: [
              "Reaproveitar l?gica sem copiar e colar",
              "Trocar a cor da interface",
              "Eliminar qualquer bug",
              "Substituir a necessidade de dados",
            ],
            answer: 0,
            explanation: "Fun??es tornam a regra reutilizavel e melhor organizada.",
          },
          {
            question: "Parametros representam:",
            options: [
              "As entradas que a fun??o recebe",
              "Os comentarios do c?digo",
              "A cor de um botao",
              "O nome do repositorio",
            ],
            answer: 0,
            explanation: "Parametro e o dado fornecido para a fun??o executar sua responsabilidade.",
          },
        ],
      }),
      lesson({
        id: "debugging",
        title: "Debug sem adivinhacao",
        time: "10 min",
        difficulty: "Nivel 16",
        objective: "Investigar bugs com metodo em vez de testar coisas aleatorias.",
        reading: [
          "Debug profissional n?o e sorte. Ele segue um processo: reproduzir o erro, observar valores, isolar a causa e testar hip?teses uma por vez.",
          "Quem depura bem n?o apenas corrige o problema atual. Tambem aprende sobre o sistema, melhora a leitura do fluxo e evita regressao futura.",
        ],
        concepts: ["Reprodu??o", "Observa??o", "Hip?tese controlada"],
        steps: [
          {
            title: "Reproduza com consistencia",
            body: "Descubra o menor passo a passo que faz o erro acontecer sempre.",
          },
          {
            title: "Inspecione os dados",
            body: "Veja quais entradas e valores intermediarios estao levando ao comportamento errado.",
          },
          {
            title: "Teste uma hip?tese por vez",
            body: "Mudar tudo junto dificulta saber qual alteracao realmente resolveu a causa.",
          },
        ],
        example: {
          label: "Checklist",
          code: [
            "1. O erro acontece sempre?",
            "2. Quais valores entraram?",
            "3. Qual etapa saiu errada?",
            "4. O esperado esta claro?",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Monte um plano de debug para um login que falha so com alguns usu?rios.",
          expected: "A resposta ideal fala de reprodu??o, compara??o de entradas e teste de hip?teses.",
          pitfalls: ["Mudar varias coisas ao mesmo tempo", "N?o registrar o caso que falhou"],
        },
        quiz: [
          {
            question: "Qual comportamento ajuda mais no debug?",
            options: [
              "Testar uma hip?tese por vez",
              "Alterar tudo de uma vez",
              "Ignorar os valores de entrada",
              "Apagar as mensagens de erro",
            ],
            answer: 0,
            explanation: "Mudanca isolada facilita descobrir a causa real do bug.",
          },
          {
            question: "Por que reproduzir o erro e tao importante?",
            options: [
              "Porque cria uma base confiavel para investigar",
              "Porque troca a linguagem automaticamente",
              "Porque evita escrever testes",
              "Porque substitui logs",
            ],
            answer: 0,
            explanation: "Sem reprodu??o consistente, o debug vira tentativa e erro sem direcao.",
          },
        ],
      }),
    ],
  },
  {
    id: "structures-and-algorithms",
    title: "Estruturas e Algoritmos",
    level: "Intermediario Plus",
    accent: "violet",
    summary: "Aqui a l?gica sobe de nivel e passa a lidar com colecoes e transformacoes maiores.",
    outcome: "Sair sabendo modelar listas, objetos, buscas e cenarios mais proximos da engenharia.",
    lessons: [
      lesson({
        id: "arrays",
        title: "Arrays e listas",
        time: "10 min",
        difficulty: "Nivel 17",
        objective: "Guardar varios itens em uma colecao ordenada e percorrer seus elementos.",
        reading: [
          "Arrays sao uma das estruturas mais importantes da programa??o. Eles aparecem em carrinhos, filas, rankings, notificacoes, tarefas e praticamente qualquer lista do produto.",
          "O segredo n?o e apenas saber que uma lista existe, mas entender como ler cada item, percorrer todos, contar elementos e gerar novas saidas a partir dela.",
        ],
        concepts: ["Colecao ordenada", "Acesso por posicao", "Itera??o"],
        steps: [
          {
            title: "Pense em conjunto",
            body: "Use arrays quando o sistema precisa lidar com varios itens do mesmo tipo.",
          },
          {
            title: "Acesse item por item",
            body: "Cada elemento pode ser lido individualmente ou como parte de uma repeticao maior.",
          },
          {
            title: "Transforme a lista",
            body: "Muitas regras consistem em filtrar, contar, ordenar ou resumir itens do array.",
          },
        ],
        example: {
          label: "Lista de alunos",
          code: ['alunos <- ["Ana", "Bia", "Caio"]', "mostrar alunos[0]"].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Explique como exibir todos os itens de um carrinho usando repeticao.",
          expected: "A resposta deve unir array e itera??o em um fluxo coerente.",
          pitfalls: ["Pensar so em um item", "Esquecer como a repeticao termina"],
        },
        quiz: [
          {
            question: "Qual estrutura combina melhor com varias tarefas de um usu?rio?",
            options: ["Array", "Booleano", "Condicional", "Comentario"],
            answer: 0,
            explanation: "Listas de itens combinam naturalmente com arrays.",
          },
          {
            question: "Percorrer um array significa:",
            options: [
              "Ler ou processar cada item da colecao",
              "Trocar a linguagem do projeto",
              "Substituir um banco de dados",
              "Apagar os elementos da memoria",
            ],
            answer: 0,
            explanation: "Iterar e visitar os elementos para aplicar alguma regra.",
          },
        ],
      }),
      lesson({
        id: "objects",
        title: "Objetos e modelagem",
        time: "10 min",
        difficulty: "Nivel 18",
        objective: "Representar entidades reais com varios atributos nomeados.",
        reading: [
          "Objetos ajudam quando um dado possui varias propriedades relacionadas entre si. Em vez de tratar tudo de forma solta, o sistema agrupa a informacao em uma entidade coerente.",
          "Modelar bem e uma habilidade profissional. Bons objetos deixam mais obvio o dominio do produto e reduzem confusao entre dados parecidos.",
        ],
        concepts: ["Chave e valor", "Entidade", "Modelagem do dominio"],
        steps: [
          {
            title: "Pense na entidade",
            body: "Pergunte qual coisa do mundo real o sistema precisa representar: usu?rio, pedido, produto, aula.",
          },
          {
            title: "Escolha propriedades uteis",
            body: "Cada atributo do objeto deve cumprir papel real na regra ou na interface.",
          },
          {
            title: "Mantenha o modelo claro",
            body: "Objetos bons se leem quase como documentacao do dominio.",
          },
        ],
        example: {
          label: "Objeto de usu?rio",
          code: [
            "usu?rio <- {",
            '  nome: "Rafa",',
            '  nivel: "intermediario",',
            "  xp: 420",
            "}",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Modele um objeto para representar uma li??o da plataforma.",
          expected: "Vale pensar em titulo, nivel, duracao e status.",
          pitfalls: ["Criar propriedades sem fun??o", "Misturar dados de varias entidades"],
        },
        quiz: [
          {
            question: "Objetos sao ideais para:",
            options: [
              "Agrupar atributos de uma entidade",
              "Representar so verdadeiro ou falso",
              "Substituir qualquer fun??o",
              "Executar repeticao automaticamente",
            ],
            answer: 0,
            explanation: "Eles organizam varios dados relacionados em uma unica estrutura.",
          },
          {
            question: "Modelagem importa porque:",
            options: [
              "Deixa o dominio mais claro e facil de evoluir",
              "Elimina a necessidade de regras",
              "Impede o uso de arrays",
              "Troca a linguagem usada",
            ],
            answer: 0,
            explanation: "Um bom modelo simplifica leitura e manutencao do sistema.",
          },
        ],
      }),
      lesson({
        id: "search-and-filter",
        title: "Busca, filtro e selecao",
        time: "10 min",
        difficulty: "Nivel 19",
        objective: "Encontrar itens especificos ou subconjuntos dentro de uma colecao.",
        reading: [
          "Muitos fluxos do mundo real dependem de procurar e selecionar dados: localizar um usu?rio por email, filtrar pedidos pagos, isolar tarefas pendentes, buscar produtos por categoria.",
          "Esse tipo de pensamento e uma ponte importante entre l?gica basica e l?gica aplicada a sistemas maiores e mais uteis.",
        ],
        concepts: ["Busca", "Filtro", "Criterio de selecao"],
        steps: [
          {
            title: "Defina a regra de busca",
            body: "Deixe claro o que faz um item ser considerado o item certo.",
          },
          {
            title: "Percorra os candidatos",
            body: "A regra so funciona se for aplicada aos elementos da colecao.",
          },
          {
            title: "Guarde ou devolva o resultado",
            body: "No final, voce precisa saber se quer um item, varios ou nenhum.",
          },
        ],
        example: {
          label: "Filtro conceitual",
          code: [
            'pedidosPagos <- filtrar pedidos onde status = "pago"',
            "mostrar pedidosPagos",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Explique como encontrar o primeiro usu?rio com plano premium em uma lista.",
          expected: "A resposta deve citar percorrer itens e comparar a propriedade desejada.",
          pitfalls: ["N?o definir o criterio", "Confundir um item com varios itens"],
        },
        quiz: [
          {
            question: "Filtrar dados significa:",
            options: [
              "Selecionar apenas itens que passam numa regra",
              "Apagar o banco inteiro",
              "Trocar o nome das variaveis",
              "Renderizar a tela mais rapido",
            ],
            answer: 0,
            explanation: "Filtro separa somente os elementos relevantes para a situacao.",
          },
          {
            question: "Buscar um item em uma lista pede principalmente:",
            options: [
              "Um criterio claro de compara??o",
              "Uma cor nova para o layout",
              "Um arquivo a mais",
              "Uma mudanca no teclado",
            ],
            answer: 0,
            explanation: "Sem criterio objetivo, o algoritmo n?o sabe como reconhecer o item certo.",
          },
        ],
      }),
      lesson({
        id: "complexity-and-edges",
        title: "Complexidade e edge cases",
        time: "11 min",
        difficulty: "Nivel 20",
        objective: "Perceber que algumas solucoes escalam melhor e tratam melhor situacoes limite.",
        reading: [
          "Uma solucao pode funcionar em tres itens e ficar ruim em trinta mil. Pensar em complexidade e comecar a medir o custo de uma regra quando os dados crescem.",
          "Ao mesmo tempo, sistemas fortes tambem tratam edge cases: lista vazia, dado nulo, duplicidade, valor fora do padrao e cenarios raros, mas possiveis.",
        ],
        concepts: ["Escala", "Custo da solucao", "Cenarios limite"],
        steps: [
          {
            title: "Compare abordagens",
            body: "Se duas solucoes resolvem o problema, veja qual repete trabalho desnecessario.",
          },
          {
            title: "Procure limites",
            body: "Pergunte o que acontece com lista vazia, item ausente ou dado inesperado.",
          },
          {
            title: "Equilibre clareza e eficiencia",
            body: "Solucao boa e aquela que continua entendivel mesmo pensando em escala.",
          },
        ],
        example: {
          label: "Pensamento profissional",
          code: [
            "Caso 1: lista com 5 itens",
            "Caso 2: lista com 50 mil itens",
            "Pergunta: a regra continua razoavel em ambos?",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Liste tres edge cases para uma busca por produto em estoque.",
          expected: "Vale pensar em lista vazia, produto inexistente e estoque zerado.",
          pitfalls: ["Pensar so no caso ideal", "Ignorar volume de dados"],
        },
        quiz: [
          {
            question: "Complexidade importa porque:",
            options: [
              "Uma solucao pode piorar bastante quando os dados crescem",
              "Ela substitui a valida??o",
              "Ela existe apenas em apps mobile",
              "Ela serve somente para design",
            ],
            answer: 0,
            explanation: "Escala muda o custo da regra, mesmo quando a l?gica ainda parece correta.",
          },
          {
            question: "Edge case e:",
            options: [
              "Um cenario limite que tambem precisa ser tratado",
              "Um tipo de botao",
              "Um pacote de animacao",
              "Um repositorio remoto",
            ],
            answer: 0,
            explanation: "Casos limite ajudam a revelar fragilidades escondidas na l?gica.",
          },
        ],
      }),
    ],
  },
  {
    id: "javascript-translation",
    title: "JavaScript e Interfaces",
    level: "Avancado",
    accent: "cobalt",
    summary: "Chegou a hora de traduzir l?gica para c?digo real e para comportamento de tela.",
    outcome: "Sair entendendo como a l?gica vira estado, eventos e rea??es no navegador.",
    lessons: [
      lesson({
        id: "js-basics",
        title: "Da l?gica para JavaScript",
        time: "10 min",
        difficulty: "Nivel 21",
        objective: "Mapear pseudocodigo para variaveis, condi??es e fun??es em JS.",
        reading: [
          "Quando voce chega ao JavaScript com l?gica forte, a linguagem deixa de parecer um monte de simbolos. Ela vira apenas a forma concreta de expressar ideias que ja estavam claras.",
          "A melhor traducao acontece quando voce reconhece equivalencias: variavel vira let ou const, condicional vira if, fun??o vira function ou arrow function, e assim por diante.",
        ],
        concepts: ["Traducao de sintaxe", "JS como implementacao", "Leitura de c?digo"],
        steps: [
          {
            title: "Parta da ideia",
            body: "N?o comece pensando em simbolos. Comece pensando na regra que precisa existir.",
          },
          {
            title: "Mapeie cada peca",
            body: "Associe variavel, condi??o e retorno aos elementos equivalentes em JavaScript.",
          },
          {
            title: "Leia o c?digo como l?gica",
            body: "Mesmo em JS, o foco continua sendo entender o fluxo, n?o decorar tudo.",
          },
        ],
        example: {
          label: "JavaScript",
          code: [
            "const idade = 19;",
            "const podeEntrar = idade >= 18;",
            'console.log(podeEntrar ? "Liberado" : "Bloqueado");',
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Converta uma regra de media de notas para JavaScript usando const e if.",
          expected: "A resposta ideal preserva a l?gica do pseudocodigo em sintaxe JS legivel.",
          pitfalls: ["Pensar so na sintaxe", "Perder o fluxo original da regra"],
        },
        quiz: [
          {
            question: "Quando a l?gica ja esta clara, JavaScript passa a ser:",
            options: [
              "A forma concreta de implementar a ideia",
              "Uma substituicao total da l?gica",
              "A unica parte que importa",
              "Um jeito de evitar modelagem",
            ],
            answer: 0,
            explanation: "Linguagem e meio de expressao; a base ainda e o racioc?nio.",
          },
          {
            question: "Traduzir bem para JS depende principalmente de:",
            options: [
              "Entender a regra antes da sintaxe",
              "Memorizar tudo sem contexto",
              "Evitar pseudocodigo",
              "Trocar de editor",
            ],
            answer: 0,
            explanation: "Quem entende a regra traduz melhor e com menos ansiedade.",
          },
        ],
      }),
      lesson({
        id: "events",
        title: "Eventos e resposta da interface",
        time: "9 min",
        difficulty: "Nivel 22",
        objective: "Entender que a tela reage a a??es da pessoa usuaria.",
        reading: [
          "Interfaces modernas sao dirigidas por eventos: clique, envio de formulario, foco, tecla pressionada, scroll e muito mais. A l?gica precisa responder a esses gatilhos.",
          "Pensar em eventos aproxima a programa??o do comportamento do produto. Cada interacao gera uma rea??o que deve ser desenhada com cuidado.",
        ],
        concepts: ["Clique e envio", "Gatilho", "Rea??o do sistema"],
        steps: [
          {
            title: "Descubra o gatilho",
            body: "Toda interacao relevante precisa de um momento exato em que a regra comeca.",
          },
          {
            title: "Defina a rea??o",
            body: "O sistema pode validar, salvar, mostrar erro, atualizar a tela ou iniciar outra a??o.",
          },
          {
            title: "Trate estados intermediarios",
            body: "Alguns eventos geram carregamento, bloqueio temporario ou feedback parcial.",
          },
        ],
        example: {
          label: "Evento",
          code: [
            "botaoSalvar.onClick -> validar formulario",
            "se estiver valido -> enviar dados",
            "mostrar feedback ao usu?rio",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Descreva a l?gica por tras do clique em um botao de concluir li??o.",
          expected: "A resposta deve incluir valida??o das respostas e atualizacao do progresso.",
          pitfalls: ["Pensar so na mudanca visual", "Esquecer a regra de liberacao da pr?xima aula"],
        },
        quiz: [
          {
            question: "Em interfaces, um evento e:",
            options: [
              "Um gatilho que inicia uma l?gica",
              "Um tipo de banco de dados",
              "Um comentario no HTML",
              "Um m?dulo de CSS",
            ],
            answer: 0,
            explanation: "Eventos disparam comportamentos em resposta a interacoes ou mudancas.",
          },
          {
            question: "Ao clicar em salvar, a interface pode precisar:",
            options: [
              "Validar, enviar e dar feedback",
              "Apenas mudar de cor",
              "Ignorar os dados",
              "Trocar de linguagem",
            ],
            answer: 0,
            explanation: "Produtos reais ligam interacao a uma cadeia de regras e respostas.",
          },
        ],
      }),
      lesson({
        id: "state",
        title: "Estado da tela",
        time: "10 min",
        difficulty: "Nivel 23",
        objective: "Perceber que toda interface exibe uma fotografia do estado atual dos dados.",
        reading: [
          "Estado e o conjunto de dados que define o que a interface mostra agora. Se a pessoa acertou, a tela muda. Se carregou, a tela muda. Se falhou, a tela muda.",
          "Entender estado e uma virada de chave porque voce deixa de pensar apenas em telas soltas e passa a pensar em transicoes entre estados.",
        ],
        concepts: ["Estado atual", "Transi??o", "UI reativa"],
        steps: [
          {
            title: "Descubra o que a tela depende",
            body: "Pergunte quais informa??es controlam o conte?do visivel e o comportamento atual.",
          },
          {
            title: "Modele as mudancas",
            body: "Toda a??o relevante altera o estado e, por consequencia, o que a tela exibe.",
          },
          {
            title: "Evite confusao",
            body: "Se o estado ficar espalhado ou ambiguo, a interface tende a se comportar de forma imprevisivel.",
          },
        ],
        example: {
          label: "Estado em a??o",
          code: [
            "estado = carregando",
            "estado = sucesso",
            "estado = erro",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Liste os estados principais da tela de uma li??o com quiz.",
          expected: "Vale pensar em lendo, respondendo, corrigido, aprovado e revisao.",
          pitfalls: ["Confundir estado com estilo visual", "Pensar so no estado final"],
        },
        quiz: [
          {
            question: "Estado da tela representa:",
            options: [
              "Os dados que definem o que aparece agora",
              "Somente a cor do fundo",
              "A conex?o do teclado",
              "A versao do navegador",
            ],
            answer: 0,
            explanation: "A UI e uma representacao visual do estado atual.",
          },
          {
            question: "Pensar em transi??o de estado ajuda a:",
            options: [
              "Desenhar melhor o comportamento do produto",
              "Eliminar eventos da interface",
              "Substituir o backend",
              "Ignorar carregamentos",
            ],
            answer: 0,
            explanation: "Produtos bons tratam como a tela muda ao longo do fluxo.",
          },
        ],
      }),
      lesson({
        id: "async-and-api",
        title: "Assincronia e APIs",
        time: "11 min",
        difficulty: "Nivel 24",
        objective: "Entender fluxos que dependem de tempo, espera e resposta externa.",
        reading: [
          "Nem toda resposta vem instantaneamente. Quando a interface depende de uma API, um banco ou outro servico, o sistema entra em um fluxo assincrono.",
          "Isso traz novos cuidados: mostrar carregamento, tratar falhas, impedir cliques duplicados e atualizar a tela apenas quando a resposta chegar.",
        ],
        concepts: ["Espera", "Carregamento", "Resposta externa"],
        steps: [
          {
            title: "Inicie o pedido",
            body: "Alguma a??o do usu?rio ou da tela dispara uma solicitacao externa.",
          },
          {
            title: "Mostre estado de espera",
            body: "Enquanto a resposta n?o chega, a interface precisa orientar a pessoa usuaria.",
          },
          {
            title: "Atualize com o retorno",
            body: "Quando a resposta vier, trate sucesso, erro e vazio de forma consistente.",
          },
        ],
        example: {
          label: "Fluxo assincrono",
          code: [
            "1. Usu?rio clica em entrar",
            "2. Sistema envia credenciais",
            "3. Tela mostra carregando",
            "4. Resposta chega e atualiza a tela",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Descreva a experiencia de uma tela que busca ranking de alunos em uma API.",
          expected: "A resposta ideal inclui carregamento, sucesso e erro.",
          pitfalls: ["Esquecer o estado de espera", "N?o pensar no que fazer se a API falhar"],
        },
        quiz: [
          {
            question: "Fluxo assincrono acontece quando:",
            options: [
              "A resposta depende de uma opera??o externa e leva tempo",
              "A interface e escura",
              "O usu?rio fecha o navegador",
              "N?o existem variaveis",
            ],
            answer: 0,
            explanation: "Assincronia aparece quando o resultado n?o e imediato.",
          },
          {
            question: "Durante uma chamada de API a UI costuma precisar de:",
            options: [
              "Estado de carregamento",
              "Apenas uma mudanca de fonte",
              "Remocao de validacoes",
              "Troca de linguagem",
            ],
            answer: 0,
            explanation: "Carregamento orienta a pessoa usuaria enquanto o resultado n?o chegou.",
          },
        ],
      }),
    ],
  },
  {
    id: "professional-systems",
    title: "Backend e Nivel Profissional",
    level: "Pro",
    accent: "coral",
    summary: "Fechamento da jornada com modelagem de fluxo real, autoriza??o, testes e produto.",
    outcome: "Sair pensando como pessoa desenvolvedora que entrega sistema utilizavel e sustentavel.",
    lessons: [
      lesson({
        id: "backend-modeling",
        title: "Modelando fluxo de backend",
        time: "10 min",
        difficulty: "Nivel 25",
        objective: "Organizar entrada, regra e resposta em servicos mais proximos do mundo real.",
        reading: [
          "No backend, a l?gica costuma receber dados externos, validar, consultar informa??es, aplicar regra de negocio e devolver uma resposta estruturada.",
          "Essa cadeia precisa ser previsivel. Quanto melhor o fluxo for modelado, mais facil fica evoluir a aplicacao e evitar efeitos colaterais estranhos.",
        ],
        concepts: ["Camadas de fluxo", "Regra de negocio", "Resposta estruturada"],
        steps: [
          {
            title: "Receba a requisicao",
            body: "Entenda quais dados o endpoint recebe e se eles sao suficientes para a opera??o.",
          },
          {
            title: "Aplique a regra",
            body: "Depois de validar, execute a l?gica central que realmente entrega valor ao produto.",
          },
          {
            title: "Responda com clareza",
            body: "A resposta deve ser consistente tanto em sucesso quanto em erro.",
          },
        ],
        example: {
          label: "Fluxo de endpoint",
          code: [
            "1. Receber email e senha",
            "2. Validar campos",
            "3. Verificar usu?rio",
            "4. Retornar acesso ou erro",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Monte o fluxo de backend para criar uma nova conta.",
          expected: "A resposta ideal inclui valida??o, verificacao de duplicidade e resposta final.",
          pitfalls: ["Esquecer verificacao de dados existentes", "N?o separar sucesso e erro"],
        },
        quiz: [
          {
            question: "Em um backend, a regra de negocio costuma acontecer:",
            options: [
              "Entre a valida??o e a resposta",
              "Antes de receber os dados",
              "Somente na camada visual",
              "Depois que o usu?rio fecha o app",
            ],
            answer: 0,
            explanation: "O backend recebe, valida, processa e depois responde.",
          },
          {
            question: "Uma resposta estruturada ajuda porque:",
            options: [
              "Mantem o comportamento previsivel para quem consome a API",
              "Troca o banco automaticamente",
              "Elimina qualquer bug",
              "Dispensa autentica??o",
            ],
            answer: 0,
            explanation: "Consistencia de resposta facilita integracao e manutencao.",
          },
        ],
      }),
      lesson({
        id: "auth-and-permissions",
        title: "Autoriza??o e permissoes",
        time: "10 min",
        difficulty: "Nivel 26",
        objective: "Distinguir quem esta autenticado de quem realmente pode fazer cada a??o.",
        reading: [
          "Entrar no sistema n?o significa poder fazer tudo. Produtos reais separam autentica??o de autoriza??o, controlando papeis, permissoes e recursos sensiveis.",
          "Essa parte exige l?gica rigorosa porque erros aqui podem gerar falhas de seguranca, exposicao de dados ou opera??es indevidas.",
        ],
        concepts: ["Autentica??o", "Autoriza??o", "Controle de acesso"],
        steps: [
          {
            title: "Confirme identidade",
            body: "Primeiro o sistema verifica quem e a pessoa usuaria.",
          },
          {
            title: "Cheque permissao",
            body: "Depois ele valida se essa pessoa pode executar a a??o desejada.",
          },
          {
            title: "Negue com seguranca",
            body: "Quando a a??o n?o e permitida, o retorno precisa ser claro sem expor dados desnecessarios.",
          },
        ],
        example: {
          label: "Fluxo de permissao",
          code: [
            "usuarioAutenticado <- verdadeiro",
            'papel <- "editor"',
            'podePublicar <- usuarioAutenticado E papel = "admin"',
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Defina a regra para permitir excluir usu?rios apenas para administradores ativos.",
          expected: "A solucao deve separar autentica??o, status e papel.",
          pitfalls: ["Confiar so no login", "Esquecer estado ativo da conta"],
        },
        quiz: [
          {
            question: "Autoriza??o responde a pergunta:",
            options: [
              "Esta pessoa pode fazer esta a??o?",
              "Qual cor a interface deve usar?",
              "Quantas linhas de CSS existem?",
              "Qual editor esta aberto?",
            ],
            answer: 0,
            explanation: "Autoriza??o trata permissao especifica sobre recursos ou a??es.",
          },
          {
            question: "Erro nessa camada pode causar:",
            options: [
              "Falhas de seguranca e acesso indevido",
              "Apenas problemas visuais",
              "Somente lentidao no scroll",
              "Nenhum impacto real",
            ],
            answer: 0,
            explanation: "Controle de acesso e uma parte cr?tica de qualquer sistema serio.",
          },
        ],
      }),
      lesson({
        id: "tests-and-maintainability",
        title: "Testes e manutencao",
        time: "10 min",
        difficulty: "Nivel 27",
        objective: "Escrever l?gica pensando em confiabilidade, revisao e evolucao futura.",
        reading: [
          "C?digo profissional n?o precisa apenas funcionar hoje. Ele precisa continuar confiavel quando a equipe mexer amanha, no pr?ximo mes e em outra feature relacionada.",
          "Por isso testes, nomes claros, fun??es menores e regras previsiveis sao sinais de maturidade. Eles reduzem regressao e aumentam velocidade da equipe.",
        ],
        concepts: ["Confiabilidade", "Testabilidade", "Legibilidade"],
        steps: [
          {
            title: "Escreva regras pequenas",
            body: "Unidades menores sao mais faceis de testar, revisar e reaproveitar.",
          },
          {
            title: "Defina expectativa",
            body: "Testar significa comparar o resultado real com um comportamento esperado.",
          },
          {
            title: "Proteja evolucoes",
            body: "Quanto mais a regra cresce, mais importante fica ter cobertura para evitar quebra silenciosa.",
          },
        ],
        example: {
          label: "L?gica melhor",
          code: [
            "calcularDescontoVip(total, anosDePlano)",
            "",
            "// melhor que",
            "f(x, y)",
          ].join("\n"),
        },
        drill: {
          title: "Missao rapida",
          prompt: "Liste o que voce testaria em uma fun??o que calcula frete gratis.",
          expected: "Vale pensar em limite m?nimo, valor acima, valor abaixo e dados invalidos.",
          pitfalls: ["Testar so um caso feliz", "Ignorar limite da regra"],
        },
        quiz: [
          {
            question: "C?digo mais facil de testar costuma ser:",
            options: [
              "Mais claro e mais focado",
              "Gigante e cheio de responsabilidades",
              "Cheio de nomes obscuros",
              "Sem retorno definido",
            ],
            answer: 0,
            explanation: "Clareza e foco reduzem ambiguidade e facilitam valida??o.",
          },
          {
            question: "Testes ajudam principalmente a:",
            options: [
              "Proteger a l?gica contra regressao",
              "Substituir toda revisao humana",
              "Eliminar qualquer manutencao",
              "Trocar o framework da equipe",
            ],
            answer: 0,
            explanation: "Eles criam seguranca para evoluir sem quebrar comportamento importante.",
          },
        ],
      }),
      lesson({
        id: "capstone-thinking",
        title: "Pensamento de produto",
        time: "12 min",
        difficulty: "Nivel 28",
        objective: "Conectar l?gica, experiencia do usu?rio e qualidade de sistema em um fluxo final.",
        reading: [
          "No nivel profissional voce deixa de pensar apenas em blocos isolados e passa a desenhar jornadas completas: entrada, valida??o, persistencia, estados de tela, erro, sucesso, auditoria e manutencao.",
          "Essa vis?o ampla faz a l?gica ganhar valor de produto. Cada decisao t?cnica afeta a experiencia do usu?rio, a opera??o do time e a confiabilidade do negocio.",
        ],
        concepts: ["Jornada completa", "Qualidade de produto", "Vis?o sistemica"],
        steps: [
          {
            title: "Pense no fluxo inteiro",
            body: "N?o foque apenas no clique. Pense no antes, durante e depois de cada a??o.",
          },
          {
            title: "Conecte t?cnica e experiencia",
            body: "Uma boa regra de negocio melhora tanto a estabilidade quanto a clareza da interface.",
          },
          {
            title: "Entregue com maturidade",
            body: "Produtos fortes equilibram valida??o, seguranca, desempenho, manutencao e boa UX.",
          },
        ],
        example: {
          label: "Fluxo completo",
          code: [
            "1. Usu?rio responde quest?es",
            "2. Sistema corrige",
            "3. Atualiza XP",
            "4. Libera pr?xima li??o",
            "5. Salva progresso",
            "6. Exibe feedback claro",
          ].join("\n"),
        },
        drill: {
          title: "Missao final",
          prompt: "Desenhe o fluxo completo de uma plataforma que corrige respostas e libera novos niveis.",
          expected: "A resposta ideal conecta interface, regra, persistencia, estados e feedback.",
          pitfalls: ["Pensar so na parte visual", "Ignorar erro, salvamento e desbloqueio"],
        },
        quiz: [
          {
            question: "Pensamento profissional se destaca quando voce:",
            options: [
              "Enxerga a jornada completa e suas dependencias",
              "Pensa so no caso feliz",
              "Escreve sem validar nada",
              "Ignora estados de erro",
            ],
            answer: 0,
            explanation: "Profissionalismo aparece na capacidade de conectar fluxo, risco e experiencia.",
          },
          {
            question: "Uma boa l?gica de produto influencia:",
            options: [
              "A experiencia do usu?rio e a qualidade do sistema",
              "Somente a cor da tela",
              "Apenas o nome das variaveis",
              "Nada alem do backend",
            ],
            answer: 0,
            explanation: "L?gica bem pensada afeta diretamente o que a pessoa usuaria percebe.",
          },
        ],
      }),
    ],
  },
];
