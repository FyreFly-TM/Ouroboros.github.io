/* Authored handbook. API catalog lives in reference.js, generated from compiler tables. */
window.OURO_DOCS = (() => {
  const pages = [];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const code = (text, label = 'Ouroboros', language = 'ouro') => `<div class="codeblock"><div class="code-head"><span>${esc(label)}</span><button class="copy-button" aria-label="Copy ${esc(label)} code">Copy code</button></div><pre><code data-language="${language}">${esc(text.trim())}</code></pre></div>`;
  const note = (title, text, warning = false) => `<div class="callout ${warning ? 'warning' : ''}"><strong>${title}</strong>${text}</div>`;
  const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const section = (id, title, body) => `<section><h2 id="${id}">${title}<a class="section-link" href="#${id}" aria-label="Link to ${title}">#</a></h2>${body}</section>`;
  const add = (id, group, title, description, sections, extra = {}) => pages.push({id, group, title, description, sections, ...extra});
  const card = (id, icon, title, text) => `<a class="card" href="#${id}"><span class="card-arrow">↗</span><span class="card-icon">${icon}</span><h3>${title}</h3><p>${text}</p></a>`;
  const li = items => `<ul>${items.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const choose = (use, other) => `<div class="choose"><div class="choose-col use"><h4>✓ Use it when</h4>${li(use)}</div><div class="choose-col else"><h4>↪ Do something else when</h4>${li(other)}</div></div>`;
  const pick = (rows, headers = ['If you need…','Use','Instead, when…']) => `<div class="table-wrap pick"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const C = s => `<code>${esc(s)}</code>`;
  const st = (kind, text) => `<span class="status ${kind}">${text}</span>`;
  const ALL = st('ok','interp · C · x64'), X64 = st('part','x64 only'), INTERP = st('part','interp · legacy'), NOTYET = st('no','not implemented');

  add('overview', 'Start here', 'A language that keeps you in control.', 'From expressive scripts to typed memory and native engine code. Learn Ouroboros one layer at a time.', [
    section('choose-path','Choose your path', `<div class="cards three">${card('quickstart','01','Write your first program','Set up the toolchain, run a script, and understand compilation.')}${card('lexical','Aa','Learn the language','Lexical rules, bindings, values, control flow, functions and modules.')}${card('pipes','-&gt;','Arrows & flows','Funnels, conditions, loops, iteration, match chains, catch and reactive bindings.')}${card('decisions','?','Which form should I use?','Side-by-side guidance for every place the language offers more than one way.')}${card('structs','&amp; *','Take control of memory','Fixed layouts, pointers, typed slices, arenas, and ownership.')}${card('engine-loop','↻','Build an engine loop','Entity systems, rendering, input, audio, and physics.')}</div>` + '<p>Looking for one specific construct? The <a href="#feature-index">feature index</a> lists every form A–Z with its status and the page that explains it. Press <kbd>Ctrl K</kbd> to search, <kbd>/</kbd> to filter the page list, and <kbd>[</kbd> / <kbd>]</kbd> to step between pages.</p>'),
    section('small-program','Small syntax. Explicit intent.', code(`// =: is a constant, := a variable; values flow along arrows.
MaxHealth =: 100
Health := 80
Health += 5

if Health < MaxHealth
    "Health: $Health" -> Print
end
Scores := [40, 95, 72]
Scores ~[It > 50]~> Print`) + '<p>Statements are separated by newlines. Blocks end with <code>end</code>. Ordinary calls (<code>Print(x)</code>) and arrows (<code>x -&gt; Print</code>) compile to the same code; the <a href="#decisions">decision guide</a> explains when each reads better.</p>'),
    section('language-layers','One language, three layers', table(['Layer','Use it for','Core concepts'],[['Values & scripts','Tools, gameplay, configuration','Gradual types · strings · arrays · maps · records'],['Systems programming','Contiguous data and explicit allocation','Structs · pointers · slices · arenas · Own/Rc'],['Engine surface','Frame-driven applications','ECS · phases · RHI · input · UI · audio · physics']]) + note('An experimental language, not a finished engine','Ouroboros has a working compiler/runtime and engine APIs. General FFI, safe scalable parallelism, a production asset pipeline, animation, networking, and a full editor remain open projects. See <a href="#limitations">compatibility and limitations</a>.')),
    section('handbook-scope','How to use this handbook','<p>The guides explain the programming model; the <a href="#api">builtin reference</a> inventories callable names from compiler tables. Worked examples state what they demonstrate. Backend-specific caveats are included rather than assuming every feature works identically everywhere.</p><p>This is documentation for the current development checkout, not a numbered stable release. Historic feature inventories may contain outdated claims. The current implementation and regression tests take precedence.</p>')
  ], {hero:true});

  add('quickstart','Start here','Installation & first program','Go from a local checkout to your first native executable.',[
    section('prerequisites','Prerequisites', '<p>Run commands from the repository root so Python can import <code>ouroboros</code>. The project metadata and current toolchain target Python 3.11+. No pip-distributed language installer is documented in this checkout.</p>' + table(['Platform','C backend','x64 / legacy'],[['Windows','MSVC Build Tools, or an available clang/gcc toolchain','MSVC ml64, link, and Windows SDK libraries'],['Linux / WSL','gcc or clang; platform layer uses libc/pthreads','Windows-only; use the C backend'],['Other platforms','Not validated by the recorded test runs','Not supported by the Win64 backends']]) + note('Recommended first backend','Use <code>--backend c</code> for a clear portable IR path. <code>auto</code> can fall back to legacy MASM, which requires Windows tools.')),
    section('hello','Hello, Ouroboros', '<p>Create <code>main.ouro</code> in your project:</p>' + code(`Print("Hello, Ouroboros!")
let Name = "builder"
Print("Welcome, $Name")`, 'main.ouro') + code(`python -m ouroboros check main.ouro
python -m ouroboros run main.ouro --backend c`, 'Terminal','shell') + '<p>The checker reports definite errors. With <code>--backend c</code>, the compiler prepares modules, lowers supported code to typed IR, generates C, and links the runtime. <code>run</code> executes the resulting program. Use <code>python -m ouroboros --help</code> and <code>python -m ouroboros compile --help</code> for available options.</p>'),
    section('interpreter','Try the interpreter', code('python -m ouroboros repl','Terminal','shell') + '<p>The REPL keeps bindings between lines. It is useful for experimenting with expressions and small statements. For complete control-flow programs, use a file and the native build/run path or the repository’s interpreter test harness.</p>'),
    section('toolchain','Toolchain overrides', table(['Variable','Purpose'],[['<code>OURO_CC</code>','Select the C compiler executable.'],['<code>OURO_ML64</code> / <code>OURO_LINK</code>','Override MASM assembler/linker tools.'],['<code>OURO_LIBPATH</code>','Override the native library lookup path.'],['<code>OURO_X64_REGALLOC=0</code>','Disable x64 register allocation for baseline comparisons.'],['<code>OURO_PHYSX_ROOT</code>','Point the optional PhysX integration at an SDK setup.']]))
  ]);

  add('tour','Start here','A practical language tour','Build familiarity with values, loops, records, and explicit data.',[
    section('tour-values','Values and intent', code(`Label =: "Ouroboros"
Score := 0
Score += 10
Enabled =: true
Samples := [10, 20, 30]
Print(Label, Score)
Samples[0] -> Print
"$Label scored $Score" -> Print`) + '<p><code>=:</code> introduces a constant; <code>:=</code> a variable (<code>let</code> and <code>mut</code> are accepted spellings of the same two ideas). Unsuffixed values infer their kind. Arrays use zero-based indices. <code>$Name</code> inside a string inserts the value.</p>'),
    section('tour-functions','Functions, iteration and flows', code(`fn Double(N)
    return N * 2
end

Numbers := [1, 2, 3]
for N in Numbers
    Print(Double(N))
end
Doubled := Numbers ~> Double
Doubled -> Print
3, 9 >- Max -> Print`) + '<p><code>fn</code> returns a value. <code>void</code> declares a procedure. Function parameters are inferred from call sites unless systems annotations are supplied. <code>~&gt;</code> sends each element through a function and collects the results; <code>&gt;-</code> feeds several values into one call. See <a href="#pipes">arrows and flows</a>.</p>'),
    section('tour-records','Named data', code(`record Hero
    Name := "Ada"
    Health := 100
end

Player := Hero{}
Player.Health := 90
Print(Player.Name)
Print(Player.Health)`) + '<p>A <code>record</code> is a template with defaults. <code>Hero{}</code> creates a heap record whose fields you read and write with <code>.</code>. A <code>struct</code>, in contrast, provides a fixed C-like memory layout for systems work.</p>'),
    section('tour-engine','A phased application', code(`on Start
    Print("Starting")

on Tick
    if (Time() > 1.0)
        Quit()
    end

on Shutdown
    Print("Finished")`) + code('python -m ouroboros play main.ouro --frames 120','Terminal','shell') + '<p>The play host owns phase dispatch and time. You do not need to write a polling frame loop yourself. Rendering and live device support require additional host options; see <a href="#engine-loop">engine lifecycle</a>. The checked-in command is <code>python -m ouroboros play</code>, with <code>--frames 0</code> for an unlimited loop until Quit/Esc.</p>')
  ]);

  add('decisions','Start here','Which form should I use?','Ouroboros often offers two spellings for one idea. This page says which to reach for, and when the other one is the better tool.',[
    section('d-bindings','Bindings and values', pick([
      ['A value that changes', C('Speed := 5'), 'Never; <code>mut Speed = 5</code> is the same thing in another spelling.'],
      ['A value that must never change', C('Limit =: 100'), 'It changes later: rebinding a top-level <code>=:</code> name is a checker error.'],
      ['A precise width (layout, ports, interop)', C('speed i32 := 5'), 'Script values: leave numbers untyped and let inference pick the width.'],
      ['Zeroed systems storage', C('pos f32') + ' / ' + C('mut V: Vec3'), 'You have a real initial value: bind it directly.'],
      ['Add or subtract one', C('count++') + ' / ' + C('count--'), 'The target is a field or element: write <code>X.F += 1</code>.'],
      ['Arithmetic on the same name', C('Hp += 5'), 'The index has side effects (<code>A[Next()] += 1</code> is rejected): bind the index first.'],
      ['Change a top-level variable from a function', C('global Score') + ' at the start of the body', 'You only read it, or change an element / field: no declaration needed.'],
      ['Scratch variables in a function', 'just assign them (they are locals)', 'The value must outlive the call: return it, or declare it <code>global</code>.']
    ])),
    section('d-data','Choosing a data shape', pick([
      ['An ordered list of values', C('[1, 2, 3]') + ' array', 'You need a packed C layout in a hot loop: <code>Slice(T)</code> over typed memory.'],
      ['Lookup by text key', C('{ gold: 10 }') + ' map', 'The set of keys is fixed and known: a record reads better and is checked.'],
      ['A named bundle of fields with defaults', C('record Hero … end') + ' + ' + C('Hero{}'), 'You need an exact memory layout or pointers: <code>struct</code>.'],
      ['Exact bytes, offsets, pointers', C('struct Vec3 … end'), 'Ordinary script data: records and maps are simpler and value-safe.'],
      ['Many similar game objects', C('entity Player … end') + ' (columns)', 'You have one object: a record or a few variables.'],
      ['A fixed set of named states', C('enum State … end'), 'States carry data: use a record field next to the enum.'],
      ['A run of integers', C('0..9') + ' (inclusive)', 'The bounds are literals and you want the classic form: <code>[0 to 9]</code> also works.'],
      ['Raw bytes', C('Buf') + ' / ' + C('MakeBuf'), 'Text: use strings; typed elements: <code>Slice(T)</code>.']
    ])),
    section('d-control','Control flow', pick([
      ['Branch with several outcomes and blocks', C('if … elseif … else … end'), 'One action guarded by a condition: <code>-[c]-&gt; Action</code> is shorter.'],
      ['Run one thing only when a condition holds', C('-[Ready]-> Fire'), 'You need an else branch: use <code>if</code> or a match chain.'],
      ['Pick a value by cases', C('x -[ 1 -> "one" | -> "other" ]-> Dest'), 'Each case runs several statements: <code>switch</code>.'],
      ['Select among strings / ints with blocks', C('switch X case "a", "b" … end'), 'You only need a value: a match chain.'],
      ['Repeat while a condition holds', C('while c … end') + ' or ' + C('~[c]~> Body'), 'The body is long or needs <code>break</code> labels: prefer <code>while</code>; one statement reads well as <code>~[c]~&gt;</code>.'],
      ['Count between two numbers', C('for I := 1 to 10 by 2'), 'You want every element of a collection: <code>for X in Arr</code>.'],
      ['Transform every element into a new array', C('D := Nums ~> Double'), 'You need the index or early exit: <code>for</code> with <code>break</code>.'],
      ['Keep only some elements', C('Nums ~[It > 2]~> F'), 'The filter needs several statements: a <code>for</code> loop with <code>if</code>.'],
      ['Leave a loop early', C('break') + ' / ' + C('break Outer'), 'Inside <code>~&gt;</code> iteration: there is no break, use a loop.']
    ])),
    section('d-calls','Calls and code organisation', pick([
      ['A reusable computation that returns a value', C('fn F(X) … return … end'), 'You want named inputs and several named outputs: a node.'],
      ['A procedure with side effects only', C('void Log(M) … end'), 'It should return something: <code>fn</code>.'],
      ['Several named results from one call', C('node N In[…] Out[A, B]'), 'One result: a function is enough.'],
      ['Call with one subject', C('F(x)') + ' or ' + C('x -> F'), 'Pick the form that reads left to right; a chain of 3+ steps reads best as arrows.'],
      ['Call with several inputs', C('a, b >- F') + ' or ' + C('F(a, b)'), 'Never write <code>a, b -&gt; F</code>: it is an error.'],
      ['Method-style reading', C('Words.Len()'), 'It hides which argument is the receiver for multi-argument calls: write the call.'],
      ['Share helpers between programs', C('use "lib/"') + ' + ' + C('export'), 'You want the other file’s statements to run here: <code>include</code>.']
    ])),
    section('d-errors','Errors and missing values', pick([
      ['A failure the caller may handle', C('Fail("msg")') + ' + ' + C('?-> Handler'), 'The outcome is expected (not found, empty): return a value such as -1 and test it.'],
      ['A default for a missing map key', C('Get(M, "k", 0)'), 'You need to know whether the key exists: <code>Has(M, "k")</code>.'],
      ['A fallback for a falsy value', C('X ?? 10'), 'Zero or "" are valid values for you: <code>??</code> replaces them too, so test explicitly.'],
      ['Stop a phase on a broken invariant', 'uncaught ' + C('Fail'), 'The program should keep the phase running: catch it with <code>?-&gt;</code>.']
    ])),
    section('d-change','Reacting to change', pick([
      ['Derived value that follows a global', C('Q -|> Double -> R'), 'The source changes by element or field writes (they do not trigger), or the dependency is inside a function.'],
      ['Work every frame', C('on Tick … end'), 'Work that happens once: <code>on Start</code>.'],
      ['Work on a fixed simulation step', C('on FixedTick … end'), 'Rendering and input: <code>on Tick</code>.'],
      ['Explicit control in a headless script', 'call ' + C('Tick()') + ' yourself', 'Under <code>play</code>: the host already calls the phases.']
    ])),
    section('d-text','Text', pick([
      ['Build a message from values', C('"Hp: $Hp"'), 'The value needs formatting or a call: <code>"Hp: " + Str(F(x))</code>.'],
      ['Glue many parts with a separator', C('Join(Parts, ", ")'), 'Two or three parts: <code>+</code> is clearer.'],
      ['A substring by inclusive positions', C('S[2..5]'), 'You have an end-exclusive length-style index: <code>Slice(S, a, b)</code>.'],
      ['Split CSV-like text', C('Split(Line, ",")'), 'Fields may contain the separator: parse character by character.']
    ])),
    section('d-files','Files in a project', pick([
      ['Executable program code', C('main.ouro'), '—'],
      ['Values shared by every script in a folder', C('world.var'), 'Values one script owns: keep them in the .ouro file.'],
      ['Entity archetypes for the whole project', C('player.ent'), 'One-off data: a record.'],
      ['A library of nodes', C('Physics.nod'), 'Ordinary functions: a .ouro module with <code>export</code>.'],
      ['Reuse definitions from another file', C('use "lib/"'), 'You need that file’s top-level statements to run: <code>include</code>.']
    ])),
    section('d-memory','Memory and ownership', pick([
      ['Ordinary values (strings, arrays, maps, records)', 'automatic', 'You need addresses, layout or manual lifetime: systems types.'],
      ['One block with a manual lifetime', C('Alloc') + ' / ' + C('Free'), 'Many short-lived blocks freed together: an arena.'],
      ['Many allocations freed at once (per frame, per level)', C('ArenaNew / ArenaAlloc / ArenaReset'), 'Individual blocks need individual lifetimes: <code>Alloc</code> or <code>Own</code>.'],
      ['A single owner that cleans up automatically', C('Own(T)') + ' + ' + C('OwnNew'), 'Several holders share it: <code>Rc(T)</code>.'],
      ['Shared ownership with explicit counting', C('Rc(T)') + ' + ' + C('RcClone / Drop'), 'Threads share it: Rc is not atomic; design synchronisation first.'],
      ['Typed contiguous elements', C('Slice(T)'), 'Untyped bytes: <code>Buf</code>; growable values: an array.']
    ])),
    section('d-concurrency','Concurrency', pick([
      ['One long-running background task', C('SpawnThread / JoinThread'), 'Many small independent tasks: a job queue.'],
      ['Many independent tasks on a worker pool', C('JobQueueNew / JobSubmit / JobWait'), 'Tasks depend on each other: a job graph.'],
      ['Tasks with dependencies', C('JobGraphNew / JobSpawnAfter'), 'No dependencies: the queue is simpler.'],
      ['A shared counter', C('AtomicI64') + ' + ' + C('AtomicAdd'), 'Several values must change together: a mutex.'],
      ['Several values updated together', C('MutexLock / MutexUnlock'), 'One integer: an atomic.']
    ])),
    section('d-ecs','Entities', pick([
      ['Visit every entity with clear names', C('each P in Player … P.Health …'), 'Short loops where bare field names cannot clash: <code>each Player</code>.'],
      ['Call one node per entity', C('Player ~> Update'), 'The body is more than one call: <code>each</code>.'],
      ['Only some entities', C('each P in Player where P.Hp > 0'), 'The filter is one node call: <code>Player ~[Hp &gt; 0]~&gt; Node</code>.'],
      ['Remember an entity across frames', 'its ' + C('Id') + ' + ' + C('FindId') + ' / ' + C('Entity@id'), 'Within one loop: the slot is fine.'],
      ['Remove entities while scanning', 'a backward ' + C('while') + ' loop with ' + C('Despawn(E, I)'), 'Removing one known entity: <code>DespawnById</code>.'],
      ['An optional component', C('AddComp / HasComp / RemoveComp'), 'Every entity has it: a normal field in the entity.']
    ])),
    section('d-web','Websites', pick([
      ['Pages that are the same for every visitor', 'a generator: ' + C('Write') + ' + ' + C('"""…"""') + ' templates', 'Content depends on the visitor or a form: a server.'],
      ['Forms, small APIs, live tools', C('HttpListen / HttpAccept / HttpRespond'), 'Public internet traffic: put a reverse proxy with HTTPS in front.'],
      ['Static files from a server', C('HttpRespondFile(R, "public" + Path)'), 'Generated HTML: build the string and use <code>HttpRespond</code>.'],
      ['After a form post', C('HttpSetHeader(R, "Location", …)') + ' + status 303', 'You only show a result once: respond with the page directly.'],
      ['Text from visitors or files in a page', C('HtmlEscape(Text)'), 'HTML you assembled yourself: insert it as it is.'],
      ['Fetching data from another service', C('HttpGet / HttpPost'), 'It needs HTTPS: not supported yet.']
    ])),
    section('d-backend','Backends', pick([
      ['Portable native build', C('--backend c'), 'You need @ASM: x64.'],
      ['Windows build with inline assembly', C('--backend x64'), 'You want Linux: C (x64 is Win64 only).'],
      ['Let the compiler choose', C('--backend auto'), 'Diagnosing a backend difference: pin c or x64 explicitly.'],
      ['Quick experiments without building', C('python -m ouroboros repl') + ' / the interpreter', 'Measuring speed: build natively.']
    ], ['If you need…','Use','Instead, when…']))
  ]);

  add('lexical','Language guide','Lexical structure','How source text becomes tokens: files, lines, comments, names, literals and the characters that change meaning with spacing.',[
    section('lx-files','Files, lines and blocks', '<p>Source files are UTF-8 text. One statement per line; a newline ends the statement. There is no semicolon. Blocks (<code>if</code>, <code>while</code>, <code>for</code>, <code>fn</code>, <code>void</code>, <code>record</code>, <code>struct</code>, <code>entity</code>, <code>enum</code>, <code>trait</code>, <code>impl</code>, <code>switch</code>, <code>each</code>, <code>with</code>) are closed by <code>end</code>. Indentation inside them is for readers only.</p><p>Two blocks also end by indentation: an <code>on Phase</code> block and a <code>node</code> body end at <code>end</code> or at the first line that is no further right than the keyword that opened them. Arrow blocks (<code>-[c]-&gt;</code> and <code>~[c]~&gt;</code> followed by a newline) end at <code>end</code>.</p>' + choose(['Always: one statement per line keeps diagnostics pointing at the right line.'], ['You want to split a long arrow chain: keep it on one line or bind intermediate results to names; there is no line-continuation character.'])),
    section('lx-comments','Comments', code(`// A line comment runs to the end of the line.
Speed := 5   // trailing comments are fine`) + '<p>Only <code>//</code> line comments exist. There are no block comments; comment several lines with <code>//</code> on each. Inside <code>@ASM { … }</code> use the assembler’s <code>;</code> comments.</p>'),
    section('lx-names','Names and keywords', '<p>Names start with a letter or underscore and continue with letters, digits or underscores. Names are case-sensitive: <code>Health</code> and <code>health</code> are different variables. Keywords are matched case-insensitively, so <code>If</code>, <code>END</code>, <code>In</code> and <code>On</code> are keywords too; node ports accept <code>In</code> specially. Builtin names are case-insensitive (<code>print</code> and <code>Print</code> are the same builtin), so do not reuse them as variable names.</p>' + note('Naming convention','Use PascalCase for variables, functions, nodes, entities and types (<code>PlayerHealth</code>, <code>Damage</code>). Entity columns are generated as <code>Entity_Field</code>, so avoid underscores in your own names where they could collide.')),
    section('lx-literals','Literals', table(['Kind','Examples','Notes'],[['Integer',C('42')+' '+C('-7'),'Unsuffixed values pick the smallest fitting signed width. No hex, binary or digit separators.'],['Integer suffix',C('42i32')+' '+C('7u8')+' '+C('1i64'),'i8 i16 i32 i64 u8 u16 u32 u64.'],['Float',C('1.5')+' '+C('2.5e-3')+' '+C('1e6'),'A decimal point or exponent makes a float.'],['Float suffix',C('1.5f')+' '+C('1.5f32')+' '+C('0.1f64')+' '+C('2.0f16'),'<code>f</code> is f32; f128 parses but is widened on native paths.'],['Boolean',C('true')+' '+C('false'),'Printed as true / false; stored as 0/1 in records.'],['String',C('"text"'),'Escapes: \\n \\r \\t \\" \\\' \\\\ \\xHH. Interpolation with $Name or ${expression}; $$ is a dollar sign. One line only.'],['Multi-line string',C('"""…"""'),'Spans lines; the closing quotes’ indentation is stripped from every line. Same escapes and interpolation.'],['Character',C("'A'")+' '+C("'\\n'"),'Escapes: \\n \\r \\t \\\' \\\\ \\0.'],['Array',C('[1, 2]')+' '+C('[7,]')+' '+C('[]'),'A single element needs the trailing comma; <code>[x]</code> is absolute value.'],['Map',C('{ gold: 10, "hp": 3 }')+' '+C('{}'),'Bare keys become strings.'],['Range',C('1..5')+' '+C('[1 to 5]'),'Both inclusive.']])),
    section('lx-operators','Operator characters', table(['Characters','Meaning'],[[C('+ - * / % ^'),'Arithmetic; <code>^</code> is power in math, XOR in conditions.'],[C('× ÷ √ ⌊x⌋ ⌈x⌉'),'Unicode spellings: multiply, divide, root, floor, ceiling.'],[C('== != < > <= >='),'Comparison.'],[C('&& || ! and or & | ~'),'Logic in conditions.'],[C(':= =: = += -= *= /= %= ++ --'),'Binding and update.'],[C('-> >- ~> -[ ]-> ~[ ]~> ?-> -|> =>'),'Arrows (see <a href="#pipes">arrows and flows</a>).'],[C('.. ?? @ & *'),'Range, coalesce, entity lookup / target, address-of, dereference.']]) + note('Spacing changes meaning','<code>a &gt;-1</code> is a funnel; write <code>a &gt; -1</code>. <code>-[x]</code> and <code>~[x]</code> open arrow conditions; write <code>- [x]</code> for minus absolute value. A minus directly before a digit can lex as a negative literal, so put spaces around binary minus. <code>++</code> and <code>--</code> are steps only after a name.',true))
  ]);

  add('bindings','Language guide','Bindings & scope','Understand mutability, assignment, naming, and where values live.',[
    section('declarations','Declarations and assignment', table(['Form','Meaning'],[['<code>X := value</code>','Mutable binding (the handbook spelling).'],['<code>X =: value</code>','Constant binding.'],['<code>speed i32 := 5</code>','Typed binding: the type follows the name. <code>Name: Type</code> is also accepted.'],['<code>pos f32</code>','Typed declaration with no value: zero-filled.'],['<code>mut X = value</code> / <code>let X = value</code>','Explicit mutable / immutable spellings.'],['<code>X = value</code>','Uses the existing bind-or-reassign scope rules.'],['<code>mut V: Vec3</code>','Zero-initialized systems-typed declaration.'],['<code>count++</code> / <code>count--</code>','Same as <code>count += 1</code> / <code>count -= 1</code> (names only).']]) + code(`Speed := 10
Speed := -5
Speed += 2
Speed++
Limit =: 100
Rate f64 := 1.5`) + '<p>Untyped numbers keep their inferred width. Types after the name work for bindings, parameters (<code>fn F(A i32)</code>), struct fields (<code>X f32</code>) and node ports. Where a type name appears decides what it means: after a name it is a type annotation, in an expression it is a conversion.</p>' + note('Assignment is not a new scope model','<code>=</code> is an additive syntax spelling, not an assignment-only operation. Do not assume C-style declarations or Rust-style shadowing. Mutable bindings can change value kind in the gradual path.')),
    section('constants','Constants', code(`Limit =: 100
Limit := 200      // error: 'Limit' is a constant (=: at 1:1)
void Raise()
    global Limit
    Limit += 1    // error too: the global is the constant
end`) + '<p>A top-level <code>=:</code> (or <code>let</code>) binding is fixed. The checker reports any later binding of that name, including <code>+=</code>, <code>++</code> and writes from functions that declare it <code>global</code>, so the interpreter and the native backends agree. Constants in a <code>.var</code> file are shared like any other public value. A parameter that happens to share the constant’s name is a separate variable inside its function.</p>'),
    section('compound','Compound assignments', '<p><code>+= -= *= /= %=</code> normalize to read → arithmetic → write. Names, fields, array indices and slice fields are supported. Compound declarations, loop binders and parameter defaults are rejected.</p>' + code(`mut Values = [10, 20]
Values[0] += 5
// Bind effectful index expressions first.
let Index = 1
Values[Index] *= 2`) + note('No hidden double call','<code>Values[NextIndex()] += 1</code> is rejected. Bind the index or pointer-producing call first. Legacy <code>X := + 2</code> is compound sugar, but <code>X = + 2</code> is ordinary unary-positive assignment.',true)),
    section('function-scope','Function scope and global', code(`Hits := 0
Name := "top"
Scores := [1, 2]
void Hit()
    global Hits
    Hits += 1         // changes the top-level Hits
    Scores[0] := 9    // changing an element needs no global
    Name := "local"   // a new local; the top-level Name is untouched
end
Hit()
Print(Hits, Name)`) + '<p>Inside a function, node or procedure, every name the body assigns (<code>:=</code>, <code>=</code>, <code>+=</code>, <code>++</code>, <code>-&gt; Name</code>, <code>for</code> / <code>with</code> variables) is a local of that function, for the whole body. To change a top-level variable, write <code>global Name</code> (or <code>global A, B</code>) at the start of the body. Reading a top-level variable needs no declaration, and changing an element or a field (<code>Scores[0] := 9</code>, <code>Hero.Hp -= 1</code>) does not rebind the name, so it needs none either. <code>global X</code> for a name with no top-level binding yet creates it when the function first assigns it. <code>for</code> and <code>with</code> variables are always local.</p>' + table(['Situation','What the checker says'],[['<code>Hits += 1</code> in a function without <code>global Hits</code>','"\'Hits\' is assigned in \'Hit\', so it is a local there and has no value yet; … write \'global Hits\'"'],['<code>V -&gt; Hits</code> in a function','"\'-&gt; Hits\' stores into the top-level \'Hits\'; declare \'global Hits\'"'],['<code>global X</code> outside a function','"\'global\' belongs at the start of a function, node or procedure"']]) + '<p><code>on</code> phase blocks are top-level code, so <code>Frame += 1</code> inside <code>on Tick</code> changes the top-level <code>Frame</code> without a declaration. Inside <code>each</code>, a bare field name such as <code>Health</code> refers to the current entity’s column, including in a function called from the loop. Typed declarations inside functions remain restricted on the IR path; do not assume unrestricted stack-local struct declarations.</p>' + choose(['A function must change a counter, score or state that lives at the top level: <code>global Name</code>.','A helper needs scratch variables: just assign them; they cannot clash with top-level names.'], ['Many functions change the same top-level values: consider passing them as parameters (by-ref) or grouping them in a record.','You only read the top-level value: no declaration is needed.'])),
    section('naming','Names and keywords','<p>Names are case-sensitive identifiers; builtin dispatch is generally case-insensitive, but use the documented conventional spelling. Avoid names that collide with builtins. The lexer recognizes keyword spellings case-insensitively, so even <code>BY</code> can collide with <code>by</code>. This matters for vector parameter names.</p><p>Files influence visibility and project discovery: <code>.ouro</code> source, <code>.var</code> public variable side files, <code>.ent</code> entity templates and <code>.nod</code> node files. See <a href="#modules">modules and projects</a>.</p>')
  ]);

  add('types','Language guide','Values & type checking','Automatic width selection meets a gradual, flow-insensitive checker.',[
    section('value-kinds','Value kinds', table(['Kind','Examples','Notes'],[['String','<code>"hello"</code>','Text with escape sequences and interpolation.'],['Character','<code>\'A\'</code>, <code>\'\\n\'</code>','Distinct literal kind; cross-backend support is less complete than strings.'],['Boolean','<code>true</code>, <code>false</code>','Predicates such as Has and Contains return Bool.'],['Integer','<code>42</code>, <code>42i32</code>, <code>42u64</code>','Unsuffixed literals select a fitting signed width.'],['Float','<code>1.5</code>, <code>1.5f32</code>, <code>1.5f64</code>','Width inference and printing differ from C’s simple double model.'],['Container','<code>[1, 2]</code>, <code>{ gold: 10 }</code>','Arrays and string-key maps.'],['Systems value','<code>Vec3</code>, <code>*Vec3</code>, <code>Slice(Vec3)</code>','Explicit layout/storage annotations.']]) + note('A suffix is not a universal native-width guarantee','The parser recognizes f128 and narrow numeric kinds, but some runtime/backends widen values or reject particular uses. The typed IR primarily uses i64/f64 representations. Do not infer end-to-end IEEE binary128 support from literal syntax.',true)),
    section('conversions','Converting between kinds', table(['Call','Result','Edge cases'],[[C('Str(42)'),'"42"','Floats print with up to six fraction digits, trailing zeros trimmed.'],[C('Int("17")'),'17','Invalid text gives 0; <code>Int(2.9)</code> truncates toward zero (2).'],[C('Float("2.5")'),'2.5','Parse failures are backend-sensitive; validate input first.'],[C('Bool(x)'),'true / false','Recognised name; prefer an explicit comparison such as <code>x != 0</code>.'],[C('i32(x)')+' / '+C('x -> i32'),'—','Reserved for width conversions but not implemented yet; use <code>Int()</code> / <code>Float()</code> or a typed binding.']]) + code(`Line := "42"
N := Int(Line) + 1
Msg := "N is " + Str(N)
Msg -> Print`) + '<p>Text and numbers never convert implicitly: <code>1 + "x"</code> is a checker error with the hint “use Str() to convert”. Integer and float operands mix freely in arithmetic, and any float operand makes the result a float.</p>'),
    section('gradual-checker','Gradual inference', '<p>The checker joins all assignments to a variable; function parameters join observed call-site arguments, and return types join observed return expressions. It is flow-insensitive: it does not narrow a variable independently within every branch. The type checker is a diagnostic gate, not a proof that every dynamic operation is safe.</p>' + table(['Join','Result'],[['Same type + same type','Keep that type.'],['Str + Char evidence','Str.'],['Int + Float evidence','Dyn, rather than silently promoting every integer.'],['Array/map evidence','Join element/value types.'],['Uncertain evidence','Dyn; definite errors are still reported.']]) + code(`mut Value = 10
Value = "ten"
// Inferred Value: Dyn. Both assignments contribute evidence.`, 'Gradual value example')),
    section('diagnostics','What the checker catches','<p>Unknown names/functions, user-function arity errors, and definite text/number operator conflicts produce diagnostics. When an unknown name closely resembles a declared variable, function, entity field, or enum variant, the checker suggests the likely spelling without changing your program. Uncertain dynamic operations may remain unchecked until runtime. Compiler, play host and test harness run the checker by default; <code>--no-check</code> skips the gate, not the semantics.</p>' + code('python -m ouroboros check main.ouro --types','Terminal','shell')),
    section('systems-inference','Systems layout inference','<p>Declared struct/pointer/slice fields carry layout information into scalar arithmetic. An integer field accumulator can remain Int instead of falling into boxed Dyn arithmetic. This is useful for hot loops, but does not replace a complete static safety or lifetime checker.</p>')
  ]);

  add('operators','Language guide','Operators & expressions','The exact surface—including the parts that are easy to misread.',[
    section('arithmetic','Arithmetic', table(['Operator','Meaning','Caveat'],[['<code>+ -</code>','Addition / subtraction','String + string concatenates; explicitly convert numbers with Str.'],['<code>*</code> / <code>×</code>','Multiplication','Prefix * is pointer dereference.'],['<code>/</code> / <code>÷</code>','Division','Exact int/int can remain integer; non-exact division can produce float.'],['<code>%</code>','Integer remainder','Not a general floating modulo API.'],['<code>^</code>','Power in math; XOR in condition grammar','Fractional exponents currently truncate on existing paths; not sqrt.'],['<code>√</code>','Unary root','Separate from Sqrt(), which has integer semantics.'],['<code>[x]</code>','Absolute value','<code>[x,]</code> is a singleton array.'],['<code>{x}</code> / <code>⌊x⌋</code>','Floor expression','Braces with key/value entries form a map.'],['<code>⌈x⌉</code>','Ceiling expression','Unicode glyph syntax.']]) + code(`let Exact = 6 / 2
let Fraction = 7 / 2
let Product = 4 * 0.5
Print(Exact)
Print(Fraction)
Print(Product)`) + note('Legacy numeric printing','Direct <code>Print(7 / 2)</code> can truncate in legacy MASM. Prefer an IR backend and validate numeric output. Binding a float result before printing is the documented compatible workaround.',true)),
    section('precedence','Precedence and associativity', '<p>Math parsing groups postfix indexing/field access, unary operators, power, multiplication/division/remainder, addition/subtraction, then coalescing and pipes. Power is right-associative; unary syntax is parsed before power. Conditions add comparisons followed by AND, XOR and OR layers. Arrows bind loosest: in statements and binding values, <code>A &gt; B -&gt; F</code> passes the comparison result to F, and <code>Ok := A &gt; 1 &amp;&amp; B &lt; 2</code> binds the whole condition. Call arguments, array elements and map values take full conditions too: <code>Str(N == 0)</code>, <code>[A &lt; B, C]</code>, <code>{"on": X == Y and Z}</code>. Use parentheses whenever mixing these families.</p>' + code(`let Result = (2 + 3) * 4
if ((Result > 10) and (Result < 30))
    Print("in range")
end`)),
    section('comparisons','Comparisons and logic','<p><code>== != &lt; &gt; &lt;= &gt;=</code> compare numbers or compatible strings. Strings compare lexicographically. Conditions accept <code>and / &amp; / &amp;&amp;</code> and <code>or / | / ||</code>; <code>!</code> and <code>~</code> negate truth. Do not assume C short-circuit semantics: evaluation may be eager. Use nested if statements when avoiding a side effect or invalid access matters.</p>'),
    section('coalescing','Coalescing and conditional expressions', code(`let Defaulted = 0 ?? 10
let Choice = if (Defaulted > 5) then "large" else "small"
Print(Choice)`) + '<p><code>??</code> chooses the right side when the left is falsy; it is not a dedicated null-only option type. If-expressions require <code>then</code> and <code>else</code>; statement blocks can use familiar bare conditions. There is no null or option type; failures use <a href="#errors">Fail and <code>?-&gt;</code></a>.</p>'),
    section('ranges','Inclusive ranges', code(`Steps := 1..4
for I in 0..2
    Print(I)
end
Word := "ouroboros"
Print(Word[0..3])
Print(Steps[1..2])`) + '<p><code>a..b</code> is the integer array a, a+1, …, b, empty when b &lt; a. Every range is inclusive. <code>S[a..b]</code> and <code>Arr[a..b]</code> slice a string or array, clamped to its length; a range index is not an assignment target. <code>Slice(S, a, b)</code> keeps its end-exclusive meaning for now.</p>')
  ]);

  add('strings','Language guide','Strings & text','Construct text, convert values, and understand byte-oriented caveats.',[
    section('string-literals','Literals and escapes', code(`let Name = "Ada"
let Greeting = "Hello, $Name"
let Explicit = "Hello, \${Name}"
let Dollar = "$$"
let Escaped = "line one\nline two\tend"
Print(Greeting)`) + '<p>Double-quoted strings support escaped characters and hexadecimal byte escapes such as <code>\\x41</code>. <code>$Name</code> and <code>${Name}</code> insert <code>Str(Name)</code>: numbers are formatted exactly as <code>Print</code> would show them and strings pass through unchanged. <code>${expression}</code> inserts any expression, and quotes are fine inside it: <code>"gold ${Get(M, "gold", 0)}"</code>. Use the braces when letters follow a name (<code>"${Hp}hp"</code>). <code>$$</code> emits a dollar sign. <code>"$Len(X)"</code> inserts the name <code>Len</code>, which the checker reports as a function used as a value; write <code>${Len(X)}</code>. A bool cannot be interpolated (<code>Str(true)</code> is an error). Character literals use single quotes.</p>'),
    section('multiline','Text on several lines', code(`Page := """
    <article>
      <h1>\${Title}</h1>
      <p>"Quotes" need no escaping here.</p>
    </article>
    """`) + '<p>A triple-quoted string spans lines. A line break right after the opening <code>"""</code> is dropped, and when the closing <code>"""</code> sits on its own line, its indentation is removed from every line (a line indented less than it is an error), so templates can be indented with the code. Escapes and interpolation work as in ordinary strings. A triple-quoted string can also stay on one line: <code>"""say "hi" """</code>.</p>' + choose(['HTML, SQL, JSON or any template longer than a line.','Text with many double quotes.'], ['A short message: ordinary quotes read better.','Text with a line that must start further left than the closing quotes: move the closing quotes left.'])),
    section('string-functions','Core text operations', table(['Call','Behavior'],[['<code>Str(value)</code> / <code>Int(text)</code> / <code>Float(text)</code>','Explicit conversion. Invalid Int text returns 0; Int(float) truncates toward zero.'],['<code>Len(text)</code>','Length; byte-length assumptions matter on native paths.'],['<code>text[a..b]</code> / <code>Slice(text, start, end)</code> / <code>text[i]</code>','Inclusive substring (clamped) / end-exclusive substring / one-character string.'],['<code>Trim / ToUpper / ToLower</code>','Trim and case conversion. Unicode casing can expand or differ between interpreter and native byte-oriented paths.'],['<code>Contains / StartsWith / EndsWith / IndexOf</code>','Search and predicates.'],['<code>Replace / PadLeft / PadRight / Repeat</code>','Text transformations; IR runtime is the preferred live path.'],['<code>Split(text, separator)</code> / <code>Join(array, separator)</code>','Split to strings / join strings. Empty split separator yields characters; trailing separators preserve empty tails.']]) + code(`let Raw = "  sword,potion  "
let Parts = Split(Trim(Raw), ",")
Print(Join(Parts, " | "))`)),
    section('unicode','Unicode and binary data', note('Do not assume Unicode grapheme indexing','The native runtime uses UTF-8 payload bytes; interpreter operations can follow Python character behavior. ASCII examples are the safest parity baseline. Length, indexing, casing and binary I/O are not a complete Unicode text model; Unicode case mappings can expand (one input character may uppercase to multiple code points).',true) + '<p><code>ReadBin</code> / <code>WriteBin</code> use a Latin-1 byte-to-string bridge. For systems byte processing, prefer Buf or typed memory rather than treating arbitrary bytes as Unicode text.</p>'),
    section('string-format','Printing and precision','<p>Standalone float output retains a float-looking integral result (for example 2.0), while array/map formatting can print integral floats without a fractional suffix. Literal/field widths and runtime conversions affect precision. Formatting rules are language semantics, not a guarantee of arbitrary numeric precision.</p>')
  ]);

  add('collections','Language guide','Arrays & maps','Value-oriented collections for everyday code; typed slices for hot data.',[
    section('array-literals','Arrays', code(`mut Values = [10, 20, 30]
Values[1] = 99
Push(Values, 40)
Print(Values)
let Single = [7,]
let Range = [1 to 5]
let Steps = 1..5
Print(Values[1..2])`) + '<p>Arrays are zero-based and support integer, float, string and nested rows. Empty arrays use <code>[]</code>; a comma distinguishes an array from absolute-value syntax. An empty <code>[]</code> takes the kind of its first <code>Push</code> (strings, integers or floats), and a float array accepts integers too. <code>[1 to 5]</code> requires ascending integer literal bounds; <code>a..b</code> takes any integer expressions and is empty when b &lt; a. <code>Arr[a..b]</code> is an inclusive, clamped slice. To transform every element, use <code>Values ~&gt; F</code> (see <a href="#pipes">arrows and flows</a>). Mixed numeric literal elements promote as documented by the checker.</p>'),
    section('array-ops','Array operations','<p><code>Push(A, value)</code>, <code>Pop(A)</code>, <code>Insert(A, index, value)</code>, <code>Clear(A)</code> and <code>Len(A)</code> provide basic mutation/query operations. Nested arrays use repeated indexing, for example <code>Grid[0][1]</code>. Index failure behavior is not fully uniform across legacy/interpreter paths; do not rely on native out-of-range zero fallbacks.</p>'),
    section('map-literals','Maps', code(`mut Inventory = { gold: 10, potion: 2 }
Inventory["gold"] = 15
if (Has(Inventory, potion))
    Print(Get(Inventory, "potion", 0))
end
Del(Inventory, "potion")
for Key, Value in Inventory
    Print(Key, Value)
end`) + '<p>Unquoted literal keys become strings. Some builtin key positions accept bare identifier names as keys, not variable lookups. Quote a key when you want its meaning to be unambiguous. <code>Get</code> supplies an explicit missing-key default. <code>Keys</code> and <code>Values</code> extract collections.</p>'),
    section('nested-data','Nested data', code(`Site := {"name": "Ouro", "post": {"title": "Hello", "views": 3}, "tags": ["a", "b"]}
Site["post"]["title"] -> Print          // Hello
Site["post"]["views"] := 4              // writes through the path
Posts := [{"title": "One"}, {"title": "Two"}]
Push(Posts, {"title": "Three"})
for P in Posts
    P["title"] -> Print
end
Data := FromJson(Read("posts.json"))    // the same shapes from JSON
for P in Data
    P["title"] -> Print
end
Push(Data, {"title": "New"})
Write("posts.json", ToJsonPretty(Data))`) + '<p>Map values can be numbers, strings, maps and arrays; arrays hold numbers, strings, arrays, or maps (an array of maps holds only maps). Index as deep as you like, and assign through a path: a missing map level is created on the way. A bool stored in a map or array becomes 1 / 0. Values from <code>FromJson</code> have a kind known only at run time; <code>for … in</code>, indexing, <code>Len</code>, <code>Push</code> and <code>ToJson</code> work on them directly (a run-time error names the problem when the value is not an array or map).</p>' + choose(['JSON-shaped data: posts, settings, API replies.','A handful of related values that travel together.'], ['Fixed fields that the checker should verify: a <a href="#records">record</a>.','Large numeric data in hot loops: <code>Slice(T)</code>.'])),
    section('collection-storage','Storage and copies','<p>The portable IR runtime uses refcounted containers and copy-on-write mutation to support value semantics. Dynamic arrays store tagged values; they are not the same representation as a contiguous C array of structs. Use <a href="#slices">Slice(T)</a> for packed typed engine data. Do not share mutable heap collections between workers without a verified synchronization/lifetime design.</p>')
  ]);

  add('control-flow','Language guide','Control flow','Conditions, counted loops, iteration, selection, and guarded bindings.',[
    section('if-blocks','If blocks and gates', code(`mut Health = 10
if (Health <= 0)
    Print("defeated")
elseif (Health < 5)
    Print("critical")
else
    Print("ready")
end

void Alert()
    Print("low health")
end
[Health < 5] -> Alert()`) + '<p>Write conditions directly: <code>if Health &lt; 5</code> and <code>while Ready</code>. Parenthesized conditions remain valid. Use <code>elseif</code>, <code>else if</code>, or <code>elif</code> for branches. A typo hint is only shown when the checker finds a genuinely close, different name; it never auto-corrects your code.</p> A bracket condition followed by a call is a tag gate. A single-line <code>if (condition) -&gt; Call()</code> form is also accepted.</p>'),
    section('loops','While and counted for', code(`mut I = 0
while (I < 3)
    Print(I)
    I += 1
end

for N := 3 to 1 by -1
    Print(N)
end`) + '<p><code>for … to</code> has inclusive bounds and optional <code>by</code> step. Use a nonzero step whose sign reaches the endpoint. The recommended assignment spelling does not remove the original <code>:=</code> loop syntax.</p>'),
    section('iteration','For-in and loop control', code(`let Items = [10, 20, 30]
for Item in Items
    if (Item == 20)
        continue
    end
    Print(Item)
end

Outer:
while (true)
    break Outer
end`) + '<p>Array iteration binds elements. Map iteration binds keys, or key/value pairs. <code>break</code> exits the nearest loop; a label can identify an outer loop. <code>continue</code> advances the nearest supported loop. Some constructs, particularly each-loop control in IR, remain restricted.</p>'),
    section('switch','Switch', code(`let Command = "look"
switch Command
    case "look", "inspect"
        Print("room")
    case "quit"
        Print("goodbye")
    else
        Print("unknown command")
end`) + '<p>Switch supports integer/string selection, shared multi-value arms, and integer literal case ranges such as <code>case 1 to 5</code>. Arms do not fall through. Strings are the clearest portable selection type; typed enum switch support may be backend-sensitive.</p>'),
    section('arrow-control','Arrow forms', code(`Speed := 6
-[Speed > 1]-> Hello
-[Speed < 8]->
    "under" -> Print
end
Count := 0
~[Count < 3]~> Count++
Cmd := "stop"
Cmd -[ "start" -> "go" | "stop" -> "halt" | -> "?" ]-> Print`) + '<p>The handbook arrow forms sit beside the block statements: <code>-[c]-&gt;</code> runs its destination (or a block closed by <code>end</code>) when c holds, <code>~[c]~&gt;</code> loops while c holds, and a match chain selects a value by arms. Both styles compile to the same code; see <a href="#pipes">arrows and flows</a> for the full rules.</p>'),
    section('with','With bindings','<p><code>with Slot := FindId(Player, id) … end</code> runs the body only when the value is considered present. FindId has a special nonnegative-index check; do not equate presence with generic truthiness when index zero is valid. See entity relations for <code>Entity@id</code> sugar.</p>')
  ]);

  add('functions','Language guide','Functions & calls','Value returns, procedures, defaults, and the mutation model.',[
    section('fn-void','fn and void', code(`fn Scale(Value, Factor := 2)
    return Value * Factor
end
void Announce(Text)
    Print(Text)
end
Print(Scale(4))
Announce("ready")`) + '<p><code>fn</code> is value-returning; <code>void</code> is a procedure. <a href="#nodes">Nodes</a> are the port-based alternative and are called the same way. A bare return leaves a procedure. Defaults use the existing parameter-binding syntax; conventional <code>=</code> also follows the normalized parser path.</p>'),
    section('parameter-mutation','Parameter mutation','<p>Name-reference arguments can bind by reference: writing a parameter may update a caller binding. Literal arguments use temporary values. IR lowering only passes references for parameters that need them, and has restrictions around forwarding references, locals, and entity columns. The interpreter evaluates function arguments before the call; treat mutation-through-parameter as a native systems feature and verify the chosen backend.</p>' + code(`void Increase(N)
    N += 1
end
mut Counter = 4
Increase(Counter)
Print(Counter)`) + note('Be explicit about mutation','This is not C’s default pass-by-value model. Use procedures with clearly named mutations, and validate aliasing behavior on the backend you intend to ship.')),
    section('recursion','Recursion and frames','<p>The C/x64 IR backends have real frames and support recursion/mutual recursion. Legacy MASM’s per-function global storage is not generally reentrant. Native workers receive arguments through the ABI rather than a single shared argument slot on IR paths.</p>'),
    section('ufcs','Uniform function-call syntax', code(`let Words = ["one", "two"]
Print(Words.Len())
let Clean = "  HELLO  " -> Trim() -> ToLower()
Print(Clean)`) + '<p><code>receiver.Method(args)</code> and value pipes insert the receiver as an argument. This is call syntax sugar, not a class/object method system. Traits provide explicit dynamic dispatch; records and structs remain distinct data models.</p>')
  ]);

  add('pipes','Language guide','Arrows & flows','Values flow left to right through nodes, conditions, loops and catches.',[
    section('pipe-family','The arrow family', table(['Syntax','Meaning'],[['<code>x -&gt; F -&gt; G</code>','Flow: x is the first argument of F, F’s result the first argument of G. <code>F(a)</code> adds arguments after the subject.'],['<code>a, b &gt;- F</code>','Funnel: every input is an argument, in order (no parentheses after F).'],['<code>x -[c]-&gt; F</code>','Conditional flow: continue only while c holds.'],['<code>-[c]-&gt; F</code> / <code>-&gt; F</code>','Empty left side: run F with no subject (when c holds).'],['<code>~[c]~&gt; Body</code>','Loop: run Body while c holds.'],['<code>xs ~&gt; F</code>','Iterate: each item through F; the results form an array.'],['<code>xs ~[c]~&gt; F</code>','Filtered iteration; <code>It</code> names the item in c.'],['<code>x -[ h -&gt; v | … ]-&gt; F</code>','Match chain: the first matching arm’s value flows on.'],['<code>x -&gt; Name</code>','Store into an existing variable, field or element.'],['<code>f ?-&gt; Handler</code>','Catch: a Fail inside f runs Handler with its message.'],['<code>Q -|&gt; chain</code>','Reactive: rerun the chain whenever Q is written.'],['<code>A() =&gt; B()</code>','Sequence side-effect calls.'],['<code>x -&gt; as Name</code> / <code>x -&gt; then A else B</code> / <code>x -&gt; [pred] F</code>','Bind the subject, choose a stage, or gate a stage on the subject.']]) + code(`N := -5 -> Abs -> Clamp(0, 3)
N -> Print
3, 9 >- Max -> Print
Line := "x,y"
Line, "," >- Split -> Len -> Print`) + note('A comma never feeds a plain arrow','<code>A, B -&gt; F</code> is an error with the hint “use &gt;-”. Write <code>A, B &gt;- F</code> when several values are the inputs.')),
    section('pipe-conditions','Conditional flows', code(`Speed := 6
"big" -[Speed > 1]-> Print
"never" -[Speed > 99]-> Print
R := Speed -> Double -[Speed > 1]-> Add(1)
-[Speed < 8]->
    "under" -> Print
end`) + '<p><code>-[c]-&gt;</code> forwards the value only when c holds. A false condition ends the flow with the value it held at that point, so <code>R</code> above is <code>Double(Speed)</code> when the condition fails. With nothing on the left, the destination runs with no subject; a newline after the arrow starts a block closed by <code>end</code>. In statements and binding values, comparisons and <code>&amp;&amp;</code> / <code>||</code> bind tighter than the arrow, so <code>3 &gt; 2 -&gt; Print</code> prints <code>true</code>.</p>'),
    section('pipe-loops','Loops and iteration', code(`Count := 0
~[Count < 3]~> Count++
~[Count < 6]~>
    Count -> Print
    Count++
end
Nums := [1, 2, 3, 4]
D := Nums ~> Double
Big := Nums ~[It > 2]~> Double
Words := ["a", "bb", "ccc"]
Words ~[Len(It) > 1]~> Print
0..2 ~> Print`) + '<p><code>~[c]~&gt;</code> is a while loop whose body is one statement, a bare node name, or a newline block closed by <code>end</code>. <code>xs ~&gt; F</code> sends each item through F and collects the results into an array; void results are dropped, so <code>Words ~&gt; Print</code> just prints. <code>~&gt;</code> on a non-array is an error.</p><p>With an entity on the left, <code>Group ~&gt; Node</code> calls <code>Node(Slot)</code> for each entity and <code>Group ~[c]~&gt; Node</code> only where c holds (bare field names in c). This form is a statement with one node.</p>'),
    section('pipe-stores','Storing results', code(`R := 0
Nums -> Len -> R
P := 5
P -> Double -> P
Box := [0, 0]
7 -> Box[1]`) + '<p>A bare name at the end of a flow stores into an existing variable; it never declares one. Fields (<code>-&gt; A.B</code>) and elements (<code>-&gt; A[i]</code>) work the same way, and the value continues to flow. When a node or builtin has that name, the call wins; a name that is both a variable and a callable is a checker error.</p>'),
    section('pipe-match','Match chains', code(`fn Label(N)
    return N -[ 0 -> "zero" | It < 0 -> "negative" | -> "positive" ]-> Trim
end
Cmd := "stop"
Code := 0
Cmd -[ "start" -> 1 | "stop" -> 2 | -> 0 ]-> Code`) + '<p>Arms are tried in order and the first match gives its value to the destination. A literal or enum-variant head is compared with <code>==</code>; any other head is a condition in which <code>It</code> is the subject. <code>| -&gt; v</code> with no head is the else arm and comes last. With no match and no else, the flow ends holding the subject. Write a bitwise OR inside an arm in parentheses.</p>'),
    section('pipe-catch','Fail and catch', code(`fn Parse(S)
    "empty input" -[Len(S) == 0]-> Fail
    return Int(S)
end
fn Log(M)
    "caught: " + M -> Print
    return -1
end
A := "21" -> Parse ?-> Log
B := "" -> Parse ?-> Log`) + '<p><code>Fail("message")</code> (or <code>"message" -&gt; Fail</code>) unwinds to the nearest <code>?-&gt;</code>, which runs its handler with the message string; the flow continues from the catch with the handler’s value. See <a href="#errors">errors and Fail</a> for uncaught failures.</p>'),
    section('pipe-reactive','Reactive bindings', code(`fn Double(X)
    return X * 2
end
Q := 1
R := 0
Q -|> Double -> R
Q := 5
R -> Print`) + '<p><code>Q -|&gt; chain</code> runs the chain on Q once when it is bound and again after every whole-value write to the global Q: bindings, <code>+=</code>, <code>++</code>, <code>-&gt; Q</code>, including writes inside functions. The chain’s result goes only where the chain says. Bindings live at the top level, may not write Q themselves, and never re-enter. Element and field writes and by-ref parameter writes do not trigger a rerun yet.</p>'),
    section('pipe-retired','Retired forms and spacing', table(['Old form','Now'],[['<code>xs *-&gt; F</code>','<code>xs ~&gt; F</code> (iteration produces the mapped array).'],['<code>x ~&gt; Print</code> as a tap','Gone; <code>~&gt;</code> iterates.'],['<code>flag ?-&gt; …</code> as a guard','Use <code>-[c]-&gt;</code>; <code>?-&gt;</code> catches Fail.'],['<code>x -|&gt; F</code> as pipe-assign','Use <code>x -&gt; F -&gt; x</code>; <code>-|&gt;</code> is reactive.']]) + '<p>Spacing matters around the new tokens: <code>a &gt;-1</code> is a funnel (write <code>a &gt; -1</code>), <code>-[x]</code> and <code>~[x]</code> open a condition (write <code>- [x]</code> for minus-absolute-value), and <code>--5</code> stays minus minus-five.</p>'),
    section('pipe-status','Coverage','<p>Every form on this page runs in the interpreter and on the C and x64 backends with identical output. The legacy MASM backend rejects the newer forms. The regression cases funnel, arrow_cond, arrow_loop, iter_basic, match_chain, catch_fail, reactive_basic, pipe_chain and pipe_seq show each form with its expected output.</p>')
  ]);

  add('nodes','Language guide','Nodes & .nod files','Named units with typed In and Out ports, callable like functions.',[
    section('node-def','Declaring a node', code(`node Damage In[Health i32, Amount i32] Out[Health i32, Dead bool]
    "negative damage" -[Amount < 0]-> Fail
    Health - Amount -> Out.Health
    Health - Amount <= 0 -> Out.Dead

node Grade In[Score] Out[Label]
    Score -[ It >= 90 -> "A" | It >= 70 -> "B" | -> "C" ]-> Out.Label`) + '<p>In ports are the parameters; a type after the port name is optional. Each Out port is a local set with <code>value -&gt; Out.Port</code>. It starts from the In port with the same name (there is no write-back to the caller), otherwise from zero; a typed non-scalar Out port needs that matching In port. The body is indented, or closed by <code>end</code>. Nodes have no <code>return</code>.</p>'),
    section('node-calls','Calling a node', code(`R := Player_Health, 12 >- Damage
R.Health -> Print
R.Dead -> Print
95 -> Grade -> Print
Scores := [50, 99]
Scores ~> Grade -> Print`) + '<p>A node is callable like any function: <code>Damage(H, A)</code>, <code>H, A &gt;- Damage</code>, <code>X -&gt; Grade</code>, <code>Xs ~&gt; Grade</code>. With one Out port the call’s value is that port. With several, the call produces a record of the ports (bools as 0/1, like ToMap). With no Out port it produces no value. <code>Damage.Dead</code> on its own is an error because it reads no call; bind the result first.</p>'),
    section('nod-files','.nod files and categories', code(`// Physics.nod
node Heal In[Hp, Amount] Out[Hp]
    Hp + Amount -> Out.Hp

// Magic.nod
node Heal In[Hp] Out[Hp]
    Hp + 1 -> Out.Hp

// main.ouro
10, 5 >- Physics.Heal -> Print
10 -> Magic.Heal -> Print`) + '<p>A <code>.nod</code> file holds node definitions only and is auto-loaded like <code>.ent</code>: from the script’s folder tree and up to three ancestor folders. The file stem is the node’s category; nodes written in the script use the script’s stem. A name defined in one category is called bare. A name in several categories must be qualified as <code>Category.Node</code>; a bare call is an error that names the files. A node may not share a function’s name.</p>')
  ]);

  add('errors','Language guide','Errors & Fail','Raise a failure with a message and catch it where it makes sense.',[
    section('fail','Raising and catching', code(`fn Parse(S)
    "empty input" -[Len(S) == 0]-> Fail
    return Int(S)
end
fn Twice(S)
    return Parse(S) * 2
end
fn Log(M)
    "caught: " + M -> Print
    return -1
end
"" -> Twice ?-> Log -> Print
"5" -> Twice ?-> Log -> Print`) + '<p><code>Fail</code> carries a string message. It unwinds through calls to the nearest <code>?-&gt;</code> on the way out; the handler receives the message and its value replaces the failed result. A handler can be any node, function or builtin that takes a string, for example <code>?-&gt; Print</code>.</p>'),
    section('uncaught','Uncaught failures', code(`void Tick1()
    "tick start" -> Print
    Fail("tick broke")
    "never" -> Print
end
void Tick2()
    "second system" -> Print
end
on Tick
    Tick1()
    Tick2()
end`) + '<p>Inside a phase (an <code>on</code> block or a manual <code>Tick()</code> call) an uncaught Fail prints <code>fail: message</code> and ends that phase: above, <code>"never"</code> and <code>Tick2</code> are skipped for this tick, and the program carries on after the phase. Anywhere else it prints <code>fail: message</code> and stops the program; a native executable exits with status 1.</p>'),
    section('error-model','What Fail is not','<p>There is no exception type hierarchy, no <code>finally</code>, and no null or option type. Fail is a message-carrying early exit with one catch operator. Use ordinary values and conditions for expected outcomes, and Fail for failures a caller may want to handle.</p>')
  ]);

  add('records','Language guide','Records & enums','Separate flexible named values from fixed-layout systems data.',[
    section('record-templates','Record templates', code(`record Hero
    Name := "Ada"
    Health := 100
end
mut H = Hero{}
H.Health = 80
Print(H.Name)
Print(GetField(H, "Health"))`) + '<p><code>NewRecord(Hero)</code>, <code>NewRecord("Hero")</code> and <code>Hero{}</code> create a heap record from defaults. Field access on heap records/maps routes through field helpers. Nested defaults can flatten into dotted keys, with prefix reconstruction for subrecords/arrays.</p>'),
    section('flat-records','Flat instances and conversion', '<p>The compatibility form <code>H := Hero</code> expands fields into names like <code>H_Health</code>. <code>H.Health</code> can resolve that flat representation. <code>ToMap(H)</code> / <code>Pack(H)</code> collect fields; <code>Unpack(M, H)</code> writes matching instance fields, and <code>Unpack(Parts, H)</code> with a string array (for example from <code>Split</code>) fills the fields in declaration order, converting numbers with Int rules (interpreter only; the IR backends refuse the array form); <code>Clone(A, B)</code> copies flat instances. This is a different representation from a fixed C-layout struct.</p>' + note('Avoid accidental representation changes','Choose either heap records for flexible named values or typed structs/slices for memory layout. Do not treat record syntax as a native ABI struct.')),
    section('enums','Enums', code(`enum State
    Idle
    Running
    Stopped
end
mut Current: State
Current = State.Running
switch Current
    case State.Running
        Print("running")
    else
        Print("not running")
end`) + code(`enum Code
    Ok
    Missing := 404
    Broken := 500
end`, 'Explicit discriminants') + '<p>Enums use C-like i32 discriminants. Variants default to sequential values starting at 0; <code>Name := 404</code> assigns an integer literal explicitly. Enums are not algebraic variants with payloads or an exhaustive-match type system. <code>State.Running</code> resolves through enum member names.</p>')
  ]);

  add('modules','Language guide','Modules & project structure','Imports, includes, exports, side files, and package discovery.',[
    section('file-model','The file model', table(['Extension','Role'],[['<code>.ouro</code>','Executable source; private script bindings.'],['<code>.var</code>','Public variable side file, auto-loaded in the same folder.'],['<code>.ent</code>','Public entity templates; discovered recursively in the script tree and up to three ancestor levels.'],['<code>.nod</code>','Node definitions only, discovered like <code>.ent</code>; the file stem is the node category. See <a href="#nodes">nodes</a>.']]) + '<p>File topology does not decide threading: <code>use</code> and <code>include</code> stay the way code is shared. <code>on</code> phase blocks belong to the main program; a module brought in with <code>use</code> may not declare them.</p>' + note('Implicit discovery matters','Adding an .ent or .var file can affect nearby programs even without an explicit use statement. Keep test fixtures isolated and inspect the resolved project context.')),
    section('use','Library imports', code(`use "lib/"
// In lib/mod.ouro:
fn Scale(Value, Factor)
    return Value * Factor
end

// For executable source and directory inclusion:
include "systems.ouro"
include "assets/"`) + '<p><code>use</code> imports supported library definitions and side files. A package directory such as <code>lib/</code> resolves to its <code>mod.ouro</code>; explicit <code>.ouro</code> and <code>.var</code> paths work for file imports. Nested imports resolve relative to source files.</p><p><code>export</code> controls exposed callables in supported module workflows; it is not arbitrary top-level execution. Import/export parity differs across interpreter, legacy and IR paths—verify your selected backend.</p>'),
    section('include','Source inclusion', code(`include "systems.ouro"
include "systems/"`) + '<p><code>include</code> splices full executable source, systems and definitions. Directory inclusion processes .ouro files in sorted order. Error messages can chain the parent include site and child location.</p>'),
    section('project-entry','Entry points and compilation','<p>CLI directory arguments resolve to <code>main.ouro</code>. Legacy module compilation can emit separate module objects with PUBLIC exports. IR import preparation and lowering are a separate path; do not assume all backends have identical incremental/module-object behavior.</p>')
  ]);

  add('project-files','Language guide','Project files: .var, .ent, .nod','Side files declare shared values, entity archetypes and node libraries that every script in a project can see.',[
    section('pf-overview','What each file holds', table(['File','Holds','Visible to','Discovered'],[[C('.ouro'),'Program code: statements, functions, nodes, on blocks','Itself (bindings are private)','Run directly, or through use / include'],[C('.var'),'Public variable bindings','Every .ouro in the same folder','Same folder, automatically; or <code>use "x.var"</code>'],[C('.ent'),'<code>entity</code> archetypes','Every .ouro in the project','Script folder tree + up to three ancestor folders'],[C('.nod'),'<code>node</code> definitions','Every .ouro in the project','Like .ent; the file stem is the category']])),
    section('pf-var','.var: shared values', code(`// world.var — shared by every script in this folder
Damage := 5
MaxHealth =: 100`, 'world.var') + code(`// main.ouro in the same folder
Health := MaxHealth
Health -= Damage
Health -> Print`, 'main.ouro') + '<p>A .var file contains bindings only (no statements that do work). Its names are public: scripts in the folder read and write them as if declared at their top. Constants declared with <code>=:</code> stay constant.</p>' + choose(['Several scripts in one folder share tuning values or state.','Configuration you want to edit without touching code.'], ['Only one script uses the value: declare it in that script.','The value belongs to a library: export it from a module brought in with <code>use</code>.'])),
    section('pf-ent','.ent: entity archetypes', code(`// player.ent
entity Player
    Health := 20
    Armed := true
end`, 'player.ent') + code(`// any main.ouro below this folder (or up to three levels under it)
Spawn(Player)
each P in Player
    P.Health -> Print
end`, 'main.ouro') + '<p>Each field becomes a public column named <code>Entity_Field</code> (<code>Player_Health</code>). Columns start empty; <code>Spawn</code> appends a row of the template defaults. Because .ent files are discovered across the tree, a nearby file can add entities to a program without a <code>use</code>; keep unrelated experiments in separate folders.</p>' + choose(['Many objects share one shape (players, enemies, bullets).','Several programs in a project use the same archetypes.'], ['A single object: a record or plain variables.','You need exact memory layout: a <code>struct</code> with <code>Slice(T)</code>.'])),
    section('pf-nod','.nod: node libraries', code(`// Physics.nod
node Damage In[Health i32, Amount i32] Out[Health i32, Dead bool]
    Health - Amount -> Out.Health
    Health - Amount <= 0 -> Out.Dead`, 'Physics.nod') + '<p>A .nod file contains node definitions only. Its stem (<code>Physics</code>) is the category. Call a node bare when its name exists in one category; qualify it as <code>Physics.Damage</code> when several categories define it. See <a href="#nodes">nodes</a>.</p>' + choose(['A family of related nodes used across programs.','You want calls grouped by category (<code>Physics.Heal</code>, <code>Magic.Heal</code>).'], ['The logic returns one value and is used in one place: a <code>fn</code> in the script.','You need <code>return</code> or early exit: nodes have no return.'])),
    section('pf-layout','A typical project layout', code(`game/
  player.ent          // archetypes for every program below game/
  enemy.ent
  Physics.nod         // node library, category "Physics"
  world/
    world.var         // shared by the scripts in world/
    main.ouro         // entry point: python -m ouroboros run game/world/
    systems.ouro      // pulled in with include "systems.ouro"
  lib/
    mod.ouro          // package entry for use "lib/"`, 'Layout', 'text') + '<p>A directory argument runs its <code>main.ouro</code>. Discovery means moving a file can change which entities or nodes a program sees, so keep each project in its own folder tree.</p>')
  ]);

  add('io','Language guide','Console & file I/O','Interact with users and persist small data safely.',[
    section('console','Console calls', code(`Print("What is your name?")
let Name = Trim(Input())
Print("Hello, " + Name)`) + '<p><code>Print(value)</code> and <code>value -&gt; Print</code> share statement behavior. Multi-argument Print is supported. <code>Input</code> reads a line without its CR/LF; <code>InputNorm</code> trims and lowercases it. Native input buffers support multiple turns.</p>'),
    section('files','Files', table(['Call','Purpose'],[['<code>Read(path)</code> / <code>Write(path, text)</code>','Text read/write. A missing Read returns an empty string.'],['<code>ReadBin(path)</code> / <code>WriteBin(path, bytes)</code>','Latin-1 string/byte bridge.'],['<code>Append(path, text)</code>','Append text.'],['<code>Exists(path)</code> / <code>Delete(path)</code>','Probe/delete a path.'],['<code>JoinPath(a, b)</code>','Combine path strings.']]) + code(`Write("save.txt", "score=10")
let Saved = Read("save.txt")
Print(Saved)`) + '<p>Folders: <code>ListDir</code>, <code>IsDir</code>, <code>MakeDir</code> and <code>CopyFile</code> are described with the <a href="#web">website tools</a>.</p>' + note('Paths and effects','Relative paths start at the script’s folder: the interpreter resolves them there, and <code>run</code> and <code>play</code> start native programs in that folder. A native executable started by hand resolves paths from wherever it was started. Writes and deletes are real filesystem effects—use a disposable project folder while learning.',true)),
    section('typed-save','Typed save and world save','<p><code>Write(path, map)</code> and <code>Read(path, Hero)</code> provide the typed-save surface, with backend restrictions. <code>SaveWorld</code> / <code>LoadWorld</code> target entity columns, using simple text formats. Neither is a production schema-versioned asset system, transaction layer, or robust arbitrary-string serialization format.</p>')
  ]);

  add('web','Language guide','Websites & HTTP','Build static sites, serve pages, forms and JSON APIs, and call other services. Every builtin here behaves the same in the interpreter and on the C and x64 backends.',[
    section('web-ways','Two ways to make a site', table(['Approach','How','Good for'],[['Static site','A build program reads content (Markdown, JSON), fills templates and writes a folder of pages (<code>Markdown</code>, <code>RenderTemplate</code>, <code>Write</code>). Open the folder in a browser or upload it to any static host.','Docs, blogs, portfolios, anything that is the same for every visitor.'],['Server','A program listens on a port and answers each request (<code>HttpListen</code>, <code>HttpAccept</code>, <code>HttpRespond</code>).','Forms, guestbooks, JSON APIs, local tools, anything per visitor.']]) + '<p>The repository example <code>examples/web/</code> does both: <code>build.ouro</code> turns <code>pages/*.md</code> into <code>public/*.html</code> through a page template, and <code>serve.ouro</code> hosts that folder plus a guestbook (JSON storage, Markdown messages, a cookie) and a small JSON API.</p>' + code(`python -m ouroboros run examples/web/build.ouro      # build public/
python -m ouroboros run examples/web/serve.ouro      # host it on http://127.0.0.1:8080/
python -m ouroboros serve --build examples/web/build.ouro   # edit with live reload`, 'Terminal', 'shell')),
    section('web-dev','The dev server (live reload)', code(`python -m ouroboros serve public                # a folder of finished pages
python -m ouroboros serve --build build.ouro    # rebuild after every change, serve public/
python -m ouroboros serve serve.ouro            # run your server program, restart it on edits`, 'Terminal', 'shell') + table(['Option','Meaning'],[[C('--port N'),'Port for the browser (8000; the next free port when it is busy).'],[C('--out DIR'),'Folder the build writes (default: <code>public/</code> next to the build script).'],[C('--native'),'Run Ouro programs with the C / x64 backend instead of the interpreter (slower restarts, production speed).'],[C('--no-open'),'Do not open the browser.']]) + '<p>Every HTML page the dev server sends gets a small script; after a rebuild or a restart, open tabs reload by themselves. A failed build or a crashed program is shown in the browser (with its output) until the next good run. A server program gets its port in the <code>PORT</code> environment variable and must listen on it: <code>HttpListen(Int(Env("PORT")))</code>; the dev server sits in front of it.</p><p>It watches source files: <code>.ouro .var .ent .md .html .css .js</code>, images and fonts (in server mode only code, pages and styles), and skips <code>build/</code>, the output folder and dot folders. Data files your program writes (<code>.json</code>, <code>.txt</code>) do not restart it.</p>' + choose(['You are editing pages, templates, styles or server code and want to see the result immediately.'], ['Serving real visitors: run the program with <code>python -m ouroboros run</code> (the dev server injects a script and turns caching off).','You need the page exactly as the build wrote it, byte for byte: open the file or use <code>run</code>.'])),
    section('web-markdown','Markdown', code(`Page := Markdown(Read("pages/about.md"))      // your own content: raw HTML allowed
Note := MarkdownSafe(HttpForm(R, "message"))  // visitor text: every tag escaped`) + table(['Write','Get'],[[C('# Title  ## Part'),'<code>&lt;h1 id="title"&gt;</code>… (ids: lower-case letters and digits, spaces become <code>-</code>, repeats get <code>-1</code>, <code>-2</code>)'],[C('*em*  _em_  **strong**  ***both***  ~~gone~~'),'em, strong, del (an <code>_</code> inside a word stays literal: snake_case)'],[C('`code`   ```lang … ```'),'inline code; fenced blocks (``` or ~~~) with <code>class="language-lang"</code>'],[C('- item   1. item   - [ ] todo   - [x] done'),'lists (nested by indentation, tight or loose), task check boxes'],[C('| a | b |  |:--|--:|'),'GFM tables with left / center / right alignment'],[C('[text](url "title")  [text][ref]  ![alt](src)'),'links, reference links (<code>[ref]: url</code> lines anywhere), images'],[C('<https://x.y>   https://x.y   <me@x.y>'),'autolinks'],[C('> quote   ---   line␣␣(two spaces)'),'blockquote, rule, hard line break (or a trailing <code>\\</code>)'],[C('<div>…</div>   &copy;'),'HTML blocks and inline tags pass through (Markdown); entities stay']]) + '<p>Not supported: underlined (setext) headings, indented code blocks (use fences), footnotes and lazy blockquote lines (start each quoted line with <code>&gt;</code>).</p>' + choose(['<code>Markdown</code> for pages you or your team write.','<code>MarkdownSafe</code> for anything a visitor typed: comments, messages, profiles.'], ['The text came from a visitor: never <code>Markdown</code> (it keeps raw HTML and script links).','You need exact CommonMark corner cases: render with a dedicated tool at build time.'])),
    section('web-templates','Templates', code(`<!-- templates/post.html -->
<article>
  <h1>{{title}}</h1>
  {{#if tags}}
  <p>{{#each tags}}<a href="/tag/{{.}}">{{.}}</a>{{#unless @last}}, {{/unless}}{{/each}}</p>
  {{/if}}
  {{{body}}}
</article>
{{> footer}}`, 'templates/post.html', 'html') + code(`Data := {"title": "Hello", "tags": ["ouro", "web"], "body": Markdown(Source)}
Write("public/hello.html", RenderTemplate("templates/post.html", Data))
Card := RenderString("<b>{{name}}</b> ({{age}})", {"name": "Ada", "age": 36})`) + table(['Tag','Meaning'],[[C('{{name}}  {{user.name}}  {{items.0}}'),'A value, HTML-escaped; missing values give "".'],[C('{{{name}}}  {{& name}}'),'A value without escaping: HTML you built yourself (Markdown output, partial pages).'],[C('{{#each xs}} … {{else}} … {{/each}}'),'Repeat for each array item (or each map value with <code>@key</code>); the else part runs when it is empty. Inside: <code>{{.}}</code> / <code>{{this}}</code>, <code>@index</code>, <code>@first</code>, <code>@last</code>.'],[C('{{#if x}} … {{else}} … {{/if}}   {{#unless x}}'),'Truthy test. Falsy: missing, "", 0, empty array or map.'],[C('{{#with user}} … {{/with}}'),'Use a map as the context: <code>{{name}}</code> means <code>user.name</code>.'],[C('{{#name}} … {{/name}}   {{^name}}'),'Mustache sections: an array repeats, a map becomes the context, a true value renders once; <code>^</code> renders when falsy.'],[C('{{> header}}'),'Insert a partial: <code>header</code>, then <code>header.html</code>, in the template’s folder.'],[C('{{! note }}'),'Comment.']]) + '<p>Names are looked up from the innermost context outward, so the page title is still visible inside <code>{{#each}}</code>. A block tag alone on its line removes the whole line, so templates can be indented freely. Ints print in decimal, floats like <code>ToJson</code>, maps and arrays as JSON (handy in <code>&lt;script&gt;</code>: <code>{{{config}}}</code>); a bool stored in a map is <code>1</code> / <code>0</code>. An unclosed block or a missing partial raises a catchable <code>Fail</code> ("template: {{#each posts}} is not closed").</p>' + choose(['A whole page or a piece of HTML longer than a few lines.','Several pages share a layout or a header: partials.','Someone who does not write Ouro edits the HTML.'], ['A short piece built in code: an interpolated string <code>"""&lt;li&gt;${HtmlEscape(Name)}&lt;/li&gt;"""</code> is simpler.','Text a visitor typed: use <code>{{name}}</code>, never <code>{{{name}}}</code>.'])),
    section('web-json','JSON', code(`Post := {"title": "Hi", "tags": ["a", "b"], "views": 3}
Text := ToJson(Post)                  // {"title":"Hi","tags":["a","b"],"views":3}
Back := FromJson(Text)
Back["tags"][1] -> Print              // b
JsonGet(Reply, "user.name") -> Print  // one field without decoding the rest
fn BadJson(Msg)
    Msg -> Print                      // invalid JSON at offset 12
    return {}
end
Data := FromJson(HttpBody(R)) ?-> BadJson`) + table(['JSON','In Ouro'],[['object','map (keys keep their order)'],['array of objects / arrays / strings','array of maps / arrays / strings'],['array of numbers','int array, or float array when any element has a fraction or exponent'],['other mixed array','array of strings: strings as they are, other elements as their JSON text'],['number','Int (Float when it has <code>.</code> / <code>e</code> or does not fit 64 bits)'],['true / false / null','1 / 0 / ""']]) + '<p><code>ToJson</code> writes maps, arrays, strings, numbers and bools (a top-level bool is <code>true</code>/<code>false</code>; inside a map it is already 1/0). Floats are written like Python’s repr (<code>2.5</code>, <code>1e-07</code>), NaN and infinity as <code>null</code>, and non-ASCII text as UTF-8. <code>ToJsonPretty</code> indents by two spaces. Paths for <code>JsonGet</code> / <code>JsonHas</code> / <code>JsonType</code> / <code>JsonLen</code> are <code>a.b.0</code> or <code>a[0].b</code>.</p>' + choose(['<code>FromJson</code> when you use most of a document, or loop over it (<code>for P in FromJson(T)</code>).','<code>JsonGet</code> when you need one or two fields of a large or irregular reply.','<code>ToJsonPretty</code> for files people read; <code>ToJson</code> on the wire.'], ['The JSON comes from outside: always catch <code>FromJson</code> with <code>?-&gt;</code>.','You need to tell <code>null</code> from <code>""</code> or <code>false</code> from <code>0</code>: check with <code>JsonType(text, path)</code>.'])),
    section('web-db','Databases (SQLite)', code(`Db := DbOpen("site.sqlite")                 // created when missing; ":memory:" for a scratch one
if Db < 0
    Fail("database: " + DbError())
end
DbExec(Db, """
    CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT NOT NULL, views INTEGER DEFAULT 0);
    CREATE INDEX IF NOT EXISTS posts_title ON posts(title);
    """, {})
DbExec(Db, "INSERT INTO posts(title) VALUES (:title)", {"title": HttpForm(R, "title")})
Id := DbLastId(Db)
for P in DbQuery(Db, "SELECT id, title, views FROM posts ORDER BY id DESC LIMIT :n", {"n": 10})
    "\${P["id"]}: \${P["title"]} (\${P["views"]} views)" -> Print
end
Changed := DbExec(Db, "UPDATE posts SET views = views + 1 WHERE id = ?", [Id,])`) + table(['Builtin','Meaning'],[[C('DbOpen(path) / DbClose(db)'),'Open (creating the file) / close a database; -1 and <code>DbError()</code> when it cannot be opened.'],[C('DbExec(db, sql, params)'),'Run every statement in the text; the number of rows changed.'],[C('DbQuery(db, sql, params)'),'Run one statement; its rows as an array of maps (column → value).'],[C('DbLastId(db)'),'The id of the last inserted row.'],[C('DbError()'),'The last database error ("" after success).']]) + '<p>Always pass values as parameters, never by gluing them into the SQL text: <code>:name</code> / <code>@name</code> / <code>$name</code> placeholders take a map (<code>{"name": V}</code>; values of any kind can mix), and <code>?</code> placeholders take an array (<code>[A, B]</code>, one kind per array; one element needs a trailing comma: <code>[Id,]</code>). Use <code>{}</code> when there are none. Results: INTEGER → Int, REAL → Float, TEXT → Str, NULL → "", BLOB → bytes in the ReadBin form. The database works in autocommit mode (each statement is saved at once); group statements with <code>BEGIN</code> / <code>COMMIT</code> for speed or atomicity. A SQL error raises a catchable <code>Fail("SQL error: …")</code> with SQLite’s own message (the same in every engine); a busy database is retried for 5 s.</p><p>The engine is the SQLite the system already has: <code>winsqlite3.dll</code> (part of Windows 10 and later), <code>libsqlite3</code> on Linux (<code>sudo apt install libsqlite3-0</code> if missing), Python’s <code>sqlite3</code> in the interpreter. Nothing is bundled with your program.</p>' + choose(['Data that grows: posts, users, orders, sessions.','Several requests read and write the same data: SQLite handles the locking.','You need searching, sorting and counting: let SQL do it.'], ['A handful of settings or a small list: a JSON file (<code>ToJsonPretty</code> / <code>FromJson</code>) is simpler.','Many servers on different machines share the data: use a database server (not built in).'])),
    section('web-time','Dates and times', code(`T := Now()                                      // Unix seconds (UTC)
FormatTime(T, "%Y-%m-%d %H:%M") -> Print         // 2026-10-20 12:03
TimeIso(T) -> Print                              // 2026-10-20T12:03:09Z
TimeHttp(T) -> Print                             // Tue, 20 Oct 2026 12:03:09 GMT
Due := MakeTime(2026, 12, 24, 18, 0, 0)
Days := (Due - T) / 86400
When := ParseTime("2026-10-20T14:03:09+02:00", "%Y-%m-%dT%H:%M:%S%z")
Started := NowMs()
Sleep(250)
(NowMs() - Started) -> Print`) + table(['Directive','Gives','Directive','Gives'],[[C('%Y %y'),'2026  26',C('%H %I %p'),'14  02  PM'],[C('%m %d %e'),'10  20  " 5"',C('%M %S'),'03  09'],[C('%b %B'),'Oct  October',C('%j'),'day of year 001–366'],[C('%a %A'),'Tue  Tuesday',C('%u %w'),'weekday 1–7 (Mon=1) / 0–6 (Sun=0)'],[C('%z %Z'),'+0200  UTC+02:00 (UTC when 0)',C('%s'),'Unix seconds'],[C('%F %T'),'%Y-%m-%d  %H:%M:%S',C('%%'),'%']]) + '<p>Times are Ints. The calendar is computed by Ouro itself (any year, before 1970 too), so every engine prints the same text. <code>ParseTime</code> reads the same directives (<code>%z</code> accepts <code>Z</code>, <code>+02:00</code> and <code>-0700</code>; a space matches any run of spaces); text that does not match raises a catchable <code>Fail</code>. <code>MakeTime</code> rolls over out-of-range parts, so <code>MakeTime(Y, M, D + 30, 0, 0, 0)</code> is 30 days later.</p>' + choose(['Store and compare times as UTC Ints; format them when you show them.','<code>TimeIso</code> for JSON and HTML <code>&lt;time datetime&gt;</code>; <code>TimeHttp</code> for headers and cookies.'], ['You show the time to a visitor: the server’s zone (<code>FormatLocalTime</code>) is rarely theirs; send <code>TimeIso</code> and let the page format it, or label times UTC.','You measure durations: <code>NowMs</code> differences, not formatted text.'])),
    section('web-files','Files and folders', table(['Builtin','Result','Notes'],[[C('ListDir(path)'),'[Str]','Entry names (files and folders), sorted; empty when the folder is missing.'],[C('IsDir(path)'),'Bool','True for an existing folder.'],[C('MakeDir(path)'),'Bool','Creates the folder and any missing parents; true when it exists afterwards.'],[C('CopyFile(src, dst)'),'Bool','Copies bytes; false when the source is missing.'],[C('FileSize(path) / FileTime(path)'),'Int','Size in bytes / modification time (Unix seconds); -1 when missing. Rebuild only what changed: <code>FileTime(Src) &gt; FileTime(Out)</code>.'],[C('Env(name)'),'Str','An environment variable; "" when unset.'],[C('Read / Write / Append / Exists / Delete'),'—','See <a href="#io">console and file I/O</a>.'],[C('MimeType(path)'),'Str','Content type from the extension (<code>text/html; charset=utf-8</code>, <code>image/png</code>, …).']]) + '<p>Relative paths start at the script’s folder: the interpreter resolves them there, and <code>python -m ouroboros run</code> starts native programs in that folder. Strings, arrays and maps of any size can be read, built and stored (a 20 MB page is fine).</p>'),
    section('web-server','A server', code(`Port := if Env("PORT") == "" then 8080 else Int(Env("PORT"))
Server := HttpListen(Port)
if Server < 0
    Fail("port $Port is in use")
end
"Serving http://127.0.0.1:$Port/" -> Print
while true
    R := HttpAccept(Server)
    Path := HttpPath(R)
    if Path == "/hello"
        Name := HttpQuery(R, "name")
        HttpRespond(R, 200, "text/plain; charset=utf-8", "hello \${Name}")
    elseif Path == "/api/time"
        HttpRespond(R, 200, "application/json", ToJson({"now": TimeIso(Now())}))
    else
        HttpRespondFile(R, "public" + Path)
    end
end`) + table(['Builtin','Meaning'],[[C('HttpListen(port)'),'Listen on 127.0.0.1 (this machine only); returns a server handle, or -1 when the port is busy.'],[C('HttpListenPublic(port)'),'Listen on every network interface, so other machines can connect (see <a href="#web/web-deploy">going public</a>).'],[C('HttpListenTls(port, cert, key) / HttpListenTlsPublic'),'The same over HTTPS with PEM certificate and key files; -1 and <code>HttpError()</code> when they cannot be loaded.'],[C('HttpAccept(server)'),'Wait for the next request and read it completely; returns a request handle.'],[C('HttpMethod(r) / HttpPath(r)'),'<code>GET</code>, <code>POST</code>, <code>HEAD</code>, …; the decoded path without the query.'],[C('HttpQuery(r, key) / HttpForm(r, key)'),'A value from <code>?key=value</code> / a posted form body (decoded; "" when missing).'],[C('HttpHeader(r, name) / HttpBody(r) / HttpCookie(r, name)'),'A request header (case-insensitive) / the raw body (JSON APIs: <code>FromJson(HttpBody(R))</code>) / a cookie.'],[C('HttpSetHeader(r, name, value) / HttpSetCookie(…)'),'Add a response header / cookie before responding.'],[C('HttpRespond(r, status, type, body)'),'Send the response and close the connection. Answer every request exactly once. 204 and 304 send no body; a HEAD request gets the headers only.'],[C('HttpRespondFile(r, path) / HttpRedirect(r, url)'),'Send a file (see <a href="#web/web-static">static files</a>) / a 302 redirect.'],[C('HttpClose(server)'),'Stop listening.']]) + '<p><code>HttpAccept</code> is an event loop: while your program handles one request, the runtime keeps reading the next ones from every open connection, so many browsers can be connected at once and a slow or stalled client holds up nobody (a request that has not finished arriving after 30 s gets <code>408</code>). HTTP/1.1 connections stay open for the next request (keep-alive, closed after 15 s idle); responses are queued and sent as each connection takes them, and the rest is sent when the program ends or calls <code>HttpClose</code>. Your handler code still runs one request at a time, so keep it short. Output printed while handling a request appears immediately, so a log line per request works as a live access log; Ctrl+C stops the program.</p>' + code(`void Serve(Arg: *u8)
  while true
    R := HttpAccept(Server)
    HttpRespond(R, 200, "text/plain", "ok")
  end
end
void Refresh(Arg: *u8)
  while true
    Write("cache.json", HttpGet("http://127.0.0.1:9000/feed"))
    Sleep(60000)
  end
end
mut A := SpawnThread(Serve, 0)
mut B := SpawnThread(Refresh, 0)
JoinThread(A)`) + '<p>Worker threads run one at a time, but a worker that waits (<code>HttpAccept</code>, <code>HttpGet</code> / <code>HttpRequest</code>, <code>Sleep</code>) lets the others run meanwhile. So a background job (refreshing a cache, polling an API) can live next to the server, as above.</p>'),
    section('web-routing','Routes', code(`if RouteMatch("/users/:id", Path)
    P := RouteParams("/users/:id", Path)
    ShowUser(R, P["id"])
elseif RouteMatch("/files/*rest", Path)
    P := RouteParams("/files/*rest", Path)
    HttpRespondFile(R, "files/" + P["rest"])
end`) + table(['Pattern part','Matches','Captured as'],[[C('users'),'exactly that segment','—'],[C(':id'),'any one non-empty segment','<code>{"id": "42"}</code>'],[C('*rest'),'the rest of the path (also nothing); last part only','<code>{"rest": "css/site.css"}</code>'],[C('*'),'the rest of the path','—']]) + '<p>One trailing slash and anything after <code>?</code> or <code>#</code> are ignored on both sides; segments compare exactly (case-sensitive). <code>HttpPath</code> is already decoded, so captures are plain text. Check routes from the most specific to the most general. Store <code>RouteParams</code> in a variable before indexing it (indexing a call result directly is not valid syntax).</p>' + choose(['Paths carry ids or names: <code>/posts/:slug</code>, <code>/api/items/:n</code>.'], ['A fixed path: <code>Path == "/about"</code> is clearer.','Many routes share a prefix and handler: a <code>switch</code> on the first segment of <code>Split(Path, "/")</code>.'])),
    section('web-forms','Forms, cookies and redirects', code(`if Path == "/guestbook" && HttpMethod(R) == "POST"
    Visitor := Trim(HttpForm(R, "name"))
    Append("guestbook.txt", Visitor + "\\n")
    HttpSetCookie(R, "visitor", UrlEncode(Visitor), "Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax")
    HttpRedirect(R, "/guestbook")
elseif Path == "/guestbook"
    Known := UrlDecode(HttpCookie(R, "visitor"))
    …
end`) + table(['Cookie attribute','Use'],[[C('Path=/'),'Send the cookie for every page (default: the current folder only).'],[C('Max-Age=N'),'Keep it N seconds (without it the cookie ends with the browser session; <code>Max-Age=0</code> deletes it).'],[C('HttpOnly'),'Page scripts cannot read it: use for session ids.'],[C('SameSite=Lax'),'Not sent on cross-site form posts: basic CSRF protection.'],[C('Secure'),'HTTPS only (browsers still allow it on http://localhost).']]) + '<p>Answer a POST with a redirect to a page that shows the result (POST, redirect, GET): reloading the page then does not post the form again. <code>HttpRedirect</code> sends 302; for 301 / 303 / 307 use <code>HttpSetHeader(R, "Location", url)</code> and <code>HttpRespond(R, 303, "text/plain", "")</code>. Cookie values cannot contain <code>;</code>, commas or spaces: <code>UrlEncode</code> them, and <code>UrlDecode</code> what <code>HttpCookie</code> returns. Header names and values are sent without line breaks, so a visitor cannot inject extra headers.</p>' + code(`<form method="post" action="/upload" enctype="multipart/form-data">
  <input name="title"> <input type="file" name="photo"> <button>Send</button>
</form>`, 'Upload form', 'html') + code(`if Path == "/upload" && HttpMethod(R) == "POST"
    Data := HttpFile(R, "photo")
    if Data == ""
        HttpRespond(R, 400, "text/plain", "no file")
    else
        Name := "uploads/" + Str(NowMs()) + ".bin"   // never the visitor's file name
        WriteBin(Name, Data)
        HttpRespond(R, 200, "text/plain", HttpForm(R, "title") + ": " + HttpFileName(R, "photo") + ", " + Str(Len(Data)) + " bytes, " + HttpFileType(R, "photo"))
    end
end`) + '<p>Forms with <code>enctype="multipart/form-data"</code> carry files. <code>HttpFile(R, field)</code> is the file’s bytes (in the same one-character-per-byte form as <code>ReadBin</code>, so <code>WriteBin</code> saves it unchanged and <code>Len</code> is the size in bytes); <code>HttpFileName</code> and <code>HttpFileType</code> are what the browser reported. All three are "" when the field has no file. <code>HttpForm</code> reads the text fields of such forms too. The whole request is limited to 16 MB (larger ones get <code>413</code> before your program sees them); one file per field name.</p>'),
    section('web-static','Static files and caching', '<p><code>HttpRespondFile(R, "public" + Path)</code> is a complete static file server:</p><ul><li>the content type comes from the extension (<code>MimeType</code>);</li><li>a folder serves its <code>index.html</code>, so <code>/</code> and <code>/docs/</code> work;</li><li>every file is sent with <code>ETag</code> (size and modification time) and <code>Last-Modified</code>; a browser that already has it (<code>If-None-Match</code> / <code>If-Modified-Since</code>) gets <code>304 Not Modified</code> and no body;</li><li>a <code>HEAD</code> request gets the headers only;</li><li>a missing file, or a path containing <code>..</code>, gets a 404 and the call returns false (true otherwise, 304 included).</li></ul><p>Browsers revalidate such files on each visit (a cheap 304). To let them skip that for assets that never change, add <code>HttpSetHeader(R, "Cache-Control", "public, max-age=86400")</code> before the call.</p>'),
    section('web-websockets','WebSockets', code(`Clients := []
while true
    R := HttpAccept(Server)
    Method := HttpMethod(R)
    if Method == "WS"                       // a message from an open socket
        for C in Clients
            WsSend(C, HttpBody(R))          // chat: send it to everyone
        end
    elseif Method == "WSCLOSE"              // a socket ended
        "left: \${WsId(R)}" -> Print
    elseif HttpPath(R) == "/chat"
        W := WsUpgrade(R)                   // the browser asked for a WebSocket
        if W > 0
            Push(Clients, W)
        else
            HttpRespond(R, 400, "text/plain", "websocket expected")
        end
    else
        HttpRespondFile(R, "public" + Path)
    end
end`) + code(`const ws = new WebSocket("ws://" + location.host + "/chat");
ws.onmessage = e => console.log(e.data);
ws.onopen = () => ws.send("hello");`, 'Browser side (JavaScript)', 'js') + '<p>The same <code>HttpAccept</code> loop serves pages and sockets. <code>WsUpgrade(R)</code> answers a WebSocket request (a GET with <code>Upgrade: websocket</code>) and returns the socket id, or -1 for an ordinary request, which you then answer as usual. After that, the socket’s traffic comes out of <code>HttpAccept</code> as events: <code>HttpMethod</code> is <code>"WS"</code> with the message in <code>HttpBody</code>, or <code>"WSCLOSE"</code> once when the socket ends (the browser closed it or the connection dropped, but not after your own <code>WsClose</code>). <code>WsId(R)</code> says which socket and <code>HttpPath</code> is the path it was opened on. Events need no answer; their handles are gone at the next <code>HttpAccept</code>.</p>' + table(['Builtin','Meaning'],[[C('WsUpgrade(R)'),'Accept a WebSocket request; the socket id (> 0), or -1.'],[C('WsSend(ws, text) / WsSendBytes(ws, bytes)'),'Send a text message / binary data (ReadBin form); false when the socket is closed.'],[C('WsClose(ws)'),'Close the socket (status 1000).'],[C('WsOpen(ws)'),'Is the socket still open?'],[C('WsId(R)'),'The socket of a WS / WSCLOSE event (0 for HTTP requests).']]) + '<p>Ping / pong, fragmented messages and the close handshake are handled for you; a message may be up to 16 MB, and binary messages arrive in the ReadBin form. Sockets have no idle timeout. On an <code>HttpListenTls</code> server they are <code>wss://</code> sockets.</p>' + code(`Ws := WsConnect("wss://chat.example.com/room")   // -1 when it fails: HttpError() says why
if Ws > 0
    WsSend(Ws, "hello")
    WsReceive(Ws) -> Print                        // waits for the next message
    while WsOpen(Ws)
        Msg := WsReceive(Ws)                      // "" once the socket is closed
        if Msg != ""
            Msg -> Print
        end
    end
end`, 'A client') + '<p>A program can also open a socket to a server itself. <code>WsConnect(url)</code> takes a <code>ws://</code> or <code>wss://</code> URL (certificates are checked as for <code>HttpGet</code>, with the same <code>HttpError()</code> texts plus <code>WebSocket handshake failed</code>) and returns the socket id. <code>WsReceive(ws)</code> waits for the next message and returns it (binary messages in the ReadBin form); it returns "" once the socket is closed, after which <code>WsOpen</code> is false. <code>WsSend</code>, <code>WsSendBytes</code>, <code>WsClose</code> and <code>WsOpen</code> work on these sockets too. A worker thread that waits in <code>WsReceive</code> lets the others run, so a bot can read in one thread and work in another. In the browser build the page’s own WebSocket does the work.</p>' + choose(['The page needs updates pushed from the server: chat, live dashboards, multiplayer state, notifications.','A program talks to a WebSocket service (a chat bot, a market feed, another Ouro server): <code>WsConnect</code>.'], ['The page only asks for data now and then: plain requests (<code>fetch</code> + a JSON route) are simpler.','You would send large files: use uploads and downloads.'])),
    section('web-client','Calling other servers', code(`Body := HttpGet("http://127.0.0.1:8080/hello?" + UrlQuery({"name": "Ada Lovelace"}))
if HttpStatus() == 200
    Body -> Print
end
Reply := HttpRequest("PUT", "http://api.local/items/7", ToJson({"done": 1}), {"Content-Type": "application/json", "Authorization": "Bearer " + Token})
HttpStatus() -> Print
HttpResponseHeader("Content-Type") -> Print
HttpRequest("DELETE", "http://api.local/items/7", "", {}) -> Print`) + '<p><code>HttpGet</code>, <code>HttpPost(url, body, contentType)</code> and <code>HttpRequest(method, url, body, headers)</code> return the response body; <code>HttpStatus()</code> is the status of the last call (0 when the server could not be reached) and <code>HttpResponseHeader(name)</code> reads its headers. A body is sent when it is not empty, and always for POST, PUT and PATCH. Up to five redirects are followed (303, and 301 / 302 after a POST, continue as GET without the body); chunked replies are decoded. <code>UrlQuery(map)</code> builds a query or form string.</p><p><code>https://</code> URLs use the operating system’s TLS: Schannel on Windows (updated by Windows Update) and the system OpenSSL on Linux, both loaded when first needed, so executables carry no TLS library; the interpreter uses Python’s <code>ssl</code>. Certificates are checked against the system’s trusted roots and the host name. When a call fails, <code>HttpStatus()</code> is 0 and <code>HttpError()</code> says why, with the same text in every engine:</p>' + table(['HttpError()','Meaning'],[['""','The call got a response (any status).'],['could not connect','No server at that host and port (or the name does not resolve).'],['certificate not trusted','Self-signed, or issued by an authority the system does not trust.'],['certificate name mismatch','The certificate is for another host name.'],['certificate expired','The certificate is out of date.'],['TLS handshake failed','Any other TLS failure.'],['no response','Connected, but no HTTP reply came back.'],['bad URL','Not an http:// or https:// URL.']]) + '<p>For a test server with a self-signed certificate, set the environment variable <code>OURO_TLS_INSECURE=1</code>: certificate checks are then skipped. Never set it in production.</p>'),
    section('web-deploy','Ports, HTTPS and going public', code(`Port := if Env("PORT") == "" then 8443 else Int(Env("PORT"))
Server := HttpListenTls(Port, "certs/fullchain.pem", "certs/privkey.pem")
if Server < 0
    Fail("could not start: " + HttpError())   // certificate could not be loaded / could not listen
end`) + '<p>Read the port from the environment (<code>Int(Env("PORT"))</code>, as most hosts and the dev server set it) with a default for local runs. <code>HttpListen</code> accepts connections from this machine only, which is right for development and for a server behind a reverse proxy on the same machine. <code>HttpListenPublic</code> accepts them from the network: use it in containers or when the proxy runs elsewhere. Build the server natively for speed (<code>python -m ouroboros build serve.ouro</code> writes an executable).</p><p><code>HttpListenTls(port, cert, key)</code> (and <code>HttpListenTlsPublic</code>) serve HTTPS themselves: everything else (routes, keep-alive, uploads) is unchanged. The certificate and key are ordinary PEM files, as Let’s Encrypt and <code>openssl</code> write them; the certificate file may hold the whole chain. TLS comes from the operating system (Schannel on Windows, the system OpenSSL on Linux; Python’s <code>ssl</code> in the interpreter), and the handshake runs inside the event loop, so a slow client never holds up the others. Connections use TLS 1.3 where the system has it (Windows 11 and Server 2022, OpenSSL 1.1.1 and later) and TLS 1.2 otherwise. The key may be RSA or EC, as PKCS#8 (<code>BEGIN PRIVATE KEY</code>), PKCS#1 (<code>BEGIN RSA PRIVATE KEY</code>) or SEC1 (<code>BEGIN EC PRIVATE KEY</code>). On Windows it is imported into the user’s key store (CNG) under the name <code>ouroboros-tls-&lt;certificate thumbprint&gt;</code>, and intermediate certificates are taken from the Windows certificate store rather than from the PEM file.</p><p>HTTP/2 needs nothing in the program: an HTTPS server offers it to browsers (ALPN <code>h2</code>), and a plain <code>HttpListen</code> server also speaks it to clients that start with the HTTP/2 preface (h2c, as proxies such as nginx and Envoy do), next to HTTP/1.1 on the same port. Each request still comes out of <code>HttpAccept</code> one at a time with the same builtins, while many streams share one connection; headers are compressed (HPACK) and large responses follow the client’s flow-control window. Set <code>OURO_NO_HTTP2=1</code> to serve HTTP/1.1 only. WebSockets keep using HTTP/1.1 connections (browsers open a separate one for them). The Ouro HTTP client speaks HTTP/1.1.</p>' + choose(['A small public site or an internal tool that should speak HTTPS without extra software.','Local testing with a self-signed certificate (<code>openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes …</code>).'], ['You want automatic certificate renewal or several sites on one port: put Caddy or nginx in front and use <code>HttpListen</code>.'])),
    section('web-security','Safety checklist', '<ul><li>Escape everything that came from a visitor or a file: <code>{{name}}</code> in templates, <code>HtmlEscape</code> in strings, <code>MarkdownSafe</code> for formatted text. Never put visitor text in <code>{{{ }}}</code> or <code>Markdown</code>.</li><li>Catch <code>FromJson</code> and <code>ParseTime</code> on outside input with <code>?-&gt;</code> and answer 400.</li><li>Session cookies: <code>HttpOnly; SameSite=Lax</code> (and <code>Secure</code> behind HTTPS).</li><li><code>HttpRespondFile</code> refuses paths containing <code>..</code>; still build file paths from a fixed folder (<code>"public" + Path</code>).</li><li>Request bodies are capped at 16 MB and headers at 1 MB; at most 500 connections are open at once.</li><li>Uploads: never use <code>HttpFileName</code> as a path; pick the stored name yourself and check <code>HttpFileType</code> / the size before keeping a file.</li><li>Handlers run one request at a time: a slow handler (a long loop, a slow outgoing call) delays the next visitor. Keep handlers short, and move slow work to a worker thread.</li><li>HTTP/2 connections get at most 100 streams at once and the same body and header caps; a client that breaks the protocol is sent a GOAWAY and disconnected.</li><li>Keep certificate checks on (<code>OURO_TLS_INSECURE</code> is for tests only).</li><li><code>HttpListenPublic</code> exposes the server to your network: prefer <code>HttpListen</code> plus a proxy.</li></ul>'),
    section('web-limits','What is not there yet','<p>The HTTP client speaks HTTP/1.1 only (servers answer it everywhere), and WebSockets do not run over HTTP/2 connections. Handlers run one request at a time; the I/O around them is concurrent. For code that runs inside the page itself, see <a href="#browser">Ouro in the browser</a>.</p>')
  ]);

  add('browser','Language guide','Ouro in the browser','Compile a program to WebAssembly and drive a web page with it: text, HTML, form values and click handlers.',[
    section('br-build','Building for the browser', code(`python -m ouroboros build app.ouro --wasm --out site     # site/app.wasm + ouro.js (+ index.html)
python -m ouroboros serve site                              # open http://127.0.0.1:8000/`, 'Terminal', 'shell') + code(`<div id="count">0</div>
<button id="plus">+1</button>
<pre id="ouro-output"></pre>
<script src="ouro.js"></script>
<script>Ouro.run("app.wasm");</script>`, 'site/index.html', 'html') + '<p>The browser build goes through the same typed IR and runtime as the native C backend, compiled for <code>wasm32</code> by LLVM: install it once (Windows: <code>winget install LLVM.LLVM</code>; Linux: <code>sudo apt install clang lld</code>; or point <code>OURO_LLVM</code> at its <code>bin</code> folder). <code>ouro.js</code> loads the program: <code>Print</code> output goes to the element with id <code>ouro-output</code> (if the page has one) and to the browser console. An <code>index.html</code> is written only when the folder has none, so your own page stays. Pages must be served over http (browsers do not load WebAssembly from <code>file://</code>); the dev server does that and reloads the page when you rebuild.</p>' + choose(['Interactive pages: calculators, games, editors, dashboards that compute in the page.','Logic you want to share between the server and the page (validation, formatting, Markdown, templates).'], ['The page only shows data from a server: plain HTML from templates is simpler and loads faster.','You need sockets, threads, SQLite or files on disk: a page has none of them (see below).'])),
    section('br-dom','The page (Dom* builtins)', code(`Count := 0

void Add(Step)                       // a handler: one Int parameter
  global Count
  Count += Step
  DomSetText("#count", Str(Count))
end

DomOn("#plus", "click", Add, 1)      // the 1 is passed to Add
DomOn("#ten", "click", Add, 10)
DomSetHtml("#note", Markdown("Click **+1** or **+10**."))
Name := DomGetValue("#name")         // an <input>'s current value`) + table(['Builtin','Meaning'],[[C('DomSetText(sel, text) / DomGetText(sel)'),'Text of the first element matching a CSS selector (set: shown as text, never as HTML).'],[C('DomSetHtml(sel, html) / DomGetHtml(sel)'),'Inner HTML (set: escape anything from a visitor first).'],[C('DomSetValue(sel, v) / DomGetValue(sel)'),'The value of an input, textarea or select.'],[C('DomSetAttr(sel, name, v) / DomGetAttr(sel, name)'),'An attribute (class, href, disabled, …).'],[C('DomOn(sel, event, Handler, N)'),'Call <code>Handler(N)</code> on each event (click, input, change, submit, keydown, …).'],[C('DomFire(sel, event)'),'Dispatch an event to the element (a synthetic click).'],[C('InBrowser()'),'True on a real page.']]) + '<p>The top level of the program runs once when the page loads (set up the page, register handlers), then each event runs its handler; globals keep their values in between. A selector that matches nothing makes setters do nothing and getters return "". Handlers are named functions with one Int parameter: pass different numbers to tell buttons apart.</p><p>Outside a page (the interpreter, native programs, Node), the same builtins work on a small simulated page with the same rules: <code>DomGet…</code> returns what was set, <code>DomSetHtml</code> also sets the text with tags removed, and <code>DomFire</code> runs the registered handlers. So a page’s logic runs and can be tested anywhere.</p>'),
    section('br-limits','What a page can and cannot do', table(['Works in the page','Different in the page'],[['All the language: functions, records, arrays, maps, nested data, Fail / ?-&gt;','<code>Sleep</code> returns at once (a page cannot block).'],['JSON, Markdown / MarkdownSafe, templates, dates and times (the visitor’s time zone)','<code>Input()</code> returns "" (there is no console input).'],['Read / Write / ListDir on an in-memory file system (<code>Ouro.run(url, {files: {"data.json": "…"}})</code> seeds it)','Files disappear when the page closes; <code>FileTime</code> is 0.'],['Print (to the page and the console)','<code>Env</code> is always "".'],['',"No sockets (HTTP server and client), threads, SQLite, engine / audio / physics: the build refuses programs that need them."]]) + '<p>Programs that need the refused groups get a clear error at build time. Use the browser’s own APIs for those needs: talk to your Ouro server over JSON routes with <code>fetch</code> from a small script, or WebSockets.</p>')
  ]);

  add('structs','Systems programming','Structs & fixed layout','Choose field widths and inspect their exact layout.',[
    section('struct-layout','Declaring a struct', code(`struct Vec3
    X: f32
    Y: f32
    Z: f32
end
mut Position: Vec3
Position.X = 1.0
Position.Y = 2.0
Print(SizeOf(Vec3))
Print(AlignOf(Vec3))
Print(OffsetOf(Vec3, Z))`) + '<p>A struct has fixed C-like field offsets, padding, size and alignment. <code>record</code> defaults and map storage do not apply. <code>mut V: Type</code> zero-initializes typed storage; assignment to fields narrows values to the field representation.</p>'),
    section('nested-structs','Nested structs', code(`struct Transform
    Position: Vec3
end
mut T: Transform
T.Position.X = 4.0
Print(T.Position.X)`) + '<p>Nested fields retain their lvalue identity: writes update the original container rather than a detached struct copy. Interpreter/C/x64 regressions cover nested paths through slice elements, typed pointers and Own. Legacy MASM does not reliably lower nested field paths; select an IR backend.</p>'),
    section('struct-limits','Layout is not full ABI integration','<p>Types have explicit primitive widths, and pointers are 64-bit on the current target model. Passing/returning whole structs, typed local declarations in functions, f16 field operations, and general C-library linking remain restricted. Query layout rather than assuming every supported C struct feature exists.</p>')
  ]);

  add('pointers','Systems programming','Pointers & raw memory','Explicit addresses, typed views, and the limits of safety.',[
    section('typed-pointers','Typed pointers', code(`struct Point
    X: i32
    Y: i32
end
mut P: Point
P.X = 1
mut Address: *Point
Address = &P
Address.X = 7
(*Address).Y = 9
Print(P.X)
Print(P.Y)`) + '<p><code>&amp;V</code> takes a variable address; <code>*T</code> annotates a typed pointer. <code>P.Field</code> can automatically dereference a pointer to struct. Parenthesized <code>(*P).Field</code> makes the intent explicit.</p>'),
    section('allocation','Allocation and bitcast', code(`let Raw = Alloc(SizeOf(Point))
let View = BitCast(*Point, Raw)
View.X = 42
Print(View.X)
Free(Raw)`) + '<p><code>Alloc</code> returns explicit heap storage; <code>Free</code> releases it. <code>BitCast</code> provides a typed view, not proof that size, alignment or lifetime are correct. Raw pointer-index stride behavior is not a universally completed feature; use typed slices for array traversal.</p>'),
    section('pointer-safety','Safety boundaries', note('Low-level control is your responsibility','Native pointers are real addresses. Interpreter capabilities catch some range/lifetime failures but do not make native raw pointers memory-safe. Do not read after Free, return references to expired storage, or assume the checker is a borrow checker.',true) + '<p>Address-of scalar storage can have interpreter snapshot behavior rather than full native alias semantics. The tested struct-pointer pattern is better established. Out-of-range/lifetime errors should be tested on your shipping backend, not only in the interpreter.</p>')
  ]);

  add('slices','Systems programming','Typed slices & byte buffers','Use contiguous data without giving up explicit allocation.',[
    section('typed-slices','Slice(T)', code(`struct Particle
    X: i64
    Velocity: i64
end
let Count = 4
let Raw = Alloc(SizeOf(Particle) * Count)
mut Particles: Slice(Particle)
Particles = MakeSlice(Raw, Count)
Particles[0].X = 10
Particles[0].Velocity = 2
Particles[0].X += Particles[0].Velocity
Print(Particles[0].X)
Free(Raw)`) + '<p>A slice is a fat pair <code>{ptr, len}</code> with a declared element type. Index addressing uses <code>SizeOf(T)</code> stride and checks index bounds. MakeSlice does not allocate or own the backing block; keep it alive for every access.</p>'),
    section('subslice','SubSlice', code(`mut Window: Slice(Particle)
Window = SubSlice(Particles, 1, 3)`, 'Use before freeing Raw') + '<p><code>SubSlice(S, start, end)</code> is end-exclusive. It shares backing memory and adjusts pointer/length. It is a view, not an independent owned copy.</p>'),
    section('byte-buffers','Buf', code(`let Raw = Alloc(16)
Fill(Raw, 9, 16)
mut Bytes: Buf
Bytes = MakeBuf(Raw, 16)
Print(Bytes[0])
Print(BufLen(Bytes))
Free(Raw)`) + '<p>Buf is an untyped byte span. <code>BufPtr</code> exposes its backing pointer; <code>BufSlice</code> creates an end-exclusive view. <code>Copy(dst, src, bytes)</code> copies memory; <code>Fill(dst, value, bytes)</code> fills bytes. Do not assume Copy has memmove semantics for overlapping regions.</p>'),
    section('checked-addresses','Hot-loop implementation','<p>The IR can reuse a checked slice-element address within a single call-free field assignment. It keeps the original bounds check and does not reuse across writes, calls or loop edges. This reduces redundant descriptor loads/stride calculation without switching off safety.</p>')
  ]);

  add('ownership','Systems programming','Arenas, Own & Rc','Separate allocation lifetime from convenient value storage.',[
    section('arenas','Arena allocation', code(`let Arena = ArenaNew(65536)
let Block = ArenaAlloc(Arena, 256)
Fill(Block, 0, 256)
ArenaReset(Arena)
ArenaDestroy(Arena)`) + '<p>ArenaNew reserves a bump-allocation region. ArenaAlloc advances its cursor; ArenaReset permits reuse, invalidating old logical allocations. ArenaDestroy releases the arena. An arena pointer must not be individually freed or dropped; the runtime reports arena affinity errors.</p>'),
    section('own','Unique ownership', code(`struct Point
    X: i32
end
mut First: Own(Point)
First = OwnNew(Point)
First.X = 12
mut Second: Own(Point)
Second = First
Print(Second.X)
Drop(Second)`) + '<p>Own(T) represents unique owned allocation. Moving a supported Own binding nulls the source; use-after-move is diagnosed on tested paths. Remaining owned values can be auto-dropped at main/function boundaries. Exact move/auto-drop behavior has backend and typed-declaration restrictions; validate it for your call pattern.</p>'),
    section('rc','Shared ownership', code(`mut Shared: Rc(Point)
Shared = RcNew(Point)
Shared.X = 7
mut Another: Rc(Point)
Another = RcClone(Shared)
Print(Another.X)
Drop(Another)
Drop(Shared)`) + '<p>Rc(T) uses explicit clone/drop reference counting. Its allocation includes a refcount header before payload. It is not advertised as atomic, race-safe shared ownership. Do not confuse systems Rc with automatic refcounting of IR strings/arrays/maps.</p>'),
    section('ownership-limits','What is not guaranteed', note('Not a Rust-style lifetime proof','The current model is not a complete borrow checker. Aliases, threads, arenas and raw pointers can outlive storage incorrectly. Main/worker heap sharing and the allocation registry still require hardening. “Own” does not imply every invalid program is rejected statically.',true))
  ]);

  add('generics-traits','Systems programming','Generics & traits','Specialize code at bind time or dispatch through a vtable.',[
    section('generics','Monomorphization', code(`struct Pair(T)
    First: T
    Second: T
end
fn Identity(T)(Value: T)
    return Value
end
mut P: Pair(i32)
P.First = 3
P.Second = 4
Print(SizeOf(Pair(i32)))
Print(Identity(i32)(7))`) + '<p>Generic type/function applications use a separate type-argument list. Preparation specializes concrete instances, for example Pair_i32. This is compile-time monomorphization rather than runtime type reflection or a template constraint system.</p>'),
    section('traits','Trait declarations and implementations', code(`trait Draw
    void Paint(Self)
end
struct Circle
    Radius: i32
end
impl Circle: Draw
    void Paint(Self)
        Print(Self.Radius)
    end
end
mut Shape: Circle
Shape.Radius = 3
mut Drawable: *dyn Draw
Drawable = AsDyn(Draw, &Shape)
Paint(Drawable)`) + '<p>A dynamic trait value is a fat data-pointer/vtable pair. AsDyn builds a view of an implementing struct. Method dispatch looks up the appropriate function slot. The underlying struct must outlive the trait view; trait-object construction does not transfer ownership.</p>'),
    section('trait-limits','Restrictions','<p>Trait implementations must lower to compatible signatures. Whole systems values and assignments to trait method parameters can be restricted. There is no documented blanket-impl, associated-type, async-trait or trait-based lifetime guarantee. Use the tested explicit struct + trait + AsDyn pattern.</p>')
  ]);

  add('concurrency','Systems programming','Threads, atomics & jobs','Understand real OS execution—and the current serialization boundary.',[
    section('threads','Threads', code(`mut Sum: AtomicI64
AtomicStore(Sum, 0)
void Worker(Arg: *u8)
    AtomicAdd(Sum, Arg)
end
let Thread = SpawnThread(Worker, 42)
JoinThread(Thread)
Print(AtomicLoad(Sum))`) + '<p>SpawnThread receives a worker function and an argument. JoinThread waits; DetachThread releases the join handle. The *u8 worker-argument spelling follows the current systems ABI; handles/arguments can be represented as integers, not a general closure capture model.</p>'),
    section('atomics','Atomics and mutexes', '<p>AtomicI64 is accessed with <code>AtomicLoad</code>, <code>AtomicStore</code>, <code>AtomicAdd</code> and <code>AtomicCas</code>. Native AtomicAdd returns the new value; CAS returns the previous value. The platform layer uses sequentially consistent operations. MutexNew/Lock/Unlock/Destroy provide explicit exclusion.</p>'),
    section('job-queues','Job queues', code(`let Queue = JobQueueNew(4)
JobSubmit(Queue, Worker, 1)
JobSubmit(Queue, Worker, 2)
JobWait(Queue)
Print(AtomicLoad(Sum))`) + '<p>A fixed worker pool drains submitted jobs. Call JobWait before consuming results or releasing job inputs. The queue API is not a substitute for an application lifetime policy.</p>'),
    section('job-graphs','Dependency graphs', code(`let Graph = JobGraphNew(4)
let A = JobSpawn(Graph, Worker, 10)
let B = JobSpawnAfter(Graph, Worker, 20, A)
let C = JobSpawnAfter2(Graph, Worker, 30, A, B)
JobWaitGraph(Graph)
JobGraphDestroy(Graph)`) + '<p>Handles express dependency edges; JobWaitHandle waits for one handle. The native graph uses work-stealing workers with finite capacity. Cycles and unbounded scheduling are not a fully validated application model.</p>'),
    section('thread-safety','The important current limitation', note('IR worker bodies are serialized','The IR thread wrapper currently executes worker bodies under a runtime-wide mutex because heap refcounts/output are not generally thread-safe. The main thread is not protected by that lock. OS threads exist, but scalable parallel gameplay and race-safe shared containers are not guaranteed. Do not remove the lock without a safety design.',true))
  ]);

  add('ecs','Engine guide','Entities & components','A data-oriented column model, not an implicit object hierarchy.',[
    section('entities','Entity archetypes', code(`entity Player
    Health := 100
    Name := "hero"
end
Spawn(Player)
each P in Player
    Print(P.Name)
    P.Health -= 10
end`) + '<p>Entity fields expand to public parallel columns such as Player_Health. Columns begin empty; Spawn appends template defaults. The entity definition remains available for later spawns. Keep related columns aligned in length.</p>'),
    section('each','Each binders and filtering', code(`each P in Player where P.Health > 0
    Print(P.slot, P.Health)
end`) + '<p>Binder form makes fields explicit. The compatibility form <code>each Player</code> exposes ambient bare fields and Id/Slot/Index. Ambient Id is the loop index, not necessarily a stable entity ID; binder P.Id can use Player_Id when present. Multi-entity each is nested Cartesian iteration, not an automatic relational join.</p>'),
    section('entity-lifetime','Spawn, despawn and relations', table(['Call','Behavior'],[['<code>Spawn(E)</code>','Append primary defaults; returns new slot.'],['<code>Despawn(E)</code>','Pop the last row.'],['<code>Despawn(E, slot)</code>','Swap-remove: another row can move into that slot.'],['<code>DespawnById(E, id)</code>','Find and swap-remove by ID; success 1/0.'],['<code>FindId(E, id)</code> / <code>E@id</code>','Resolve ID to slot; -1 if missing.']]) + note('Slot ≠ stable identity','Cache an ID when you need identity, then resolve a current slot. Swap removal makes retained indices stale. Automatic generation-checked entity handles and a production query planner are future engine work.',true)),
    section('despawn-loop','Removing entities while scanning', code(`I := Len(Mob_Hp) - 1
while I >= 0
    if Mob_Hp[I] == 0
        Despawn(Mob, I)
    end
    I -= 1
end`) + '<p><code>Despawn(E, slot)</code> swap-removes: the last row moves into the freed slot. Walking backwards means the row that moves has already been visited, so nothing is skipped. Inside an <code>each</code> loop the slots shift under you, and the IR backends refuse <code>Push</code> onto an array inside <code>each</code>, so do removal in a plain loop like this one.</p>' + note('Several entities in one loop','<code>each A, B … end</code> visits every pair (A outer, B inner); with binders write <code>each P in Player, E in Enemy</code>. Bare field names that exist in both entities are ambiguous; use binders or the full <code>Entity_Field</code> name.')),
    section('sparse','Optional components','<p><code>AddComp(E, Field, value)</code> maintains a padded column and Has_Field presence flags. RemoveComp clears presence; HasComp probes the current slot in each contexts. Spawn only appends primary/default columns; sparse columns follow their own rules. Optional components run in the interpreter and on the C and x64 backends.</p>'),
    section('group-flow','Entity flows', code(`void Seen(I)
    "mob " + Str(I) -> Print
end
Mob ~> Seen
Mob ~[Hp < 5]~> Seen`) + '<p><code>Group ~&gt; Node</code> calls the node with each entity’s slot, the same as <code>each Group Node(Slot) end</code>; <code>Group ~[c]~&gt; Node</code> adds a where-condition using bare field names.</p>'),
    section('world-io','World persistence','<p>SaveWorld/LoadWorld persist primary arrays using a simple text representation (count header, integer CSV or string-separated lines), in the interpreter and on C/x64. This is suitable for demos, not arbitrary text escaping, schema migration or a production scene database. Test optional-component persistence requirements explicitly.</p>')
  ]);

  add('engine-loop','Engine guide','Lifecycle & frame systems','Let the host own time, phase dispatch, and presentation.',[
    section('phases','Four lifecycle phases', table(['Phase','Purpose'],[['Start','Initialize game state and assets once.'],['FixedTick','Fixed-step simulation; may run multiple times per frame.'],['Tick','Frame updates/input/rendering.'],['Shutdown','Release application state before host teardown.']]) + code(`on Start
    SetFixedDt(0.0166666667)
    Print("boot")
on FixedTick
    let Step = FixedDt()
on Tick
    if (Time() > 2.0)
        Quit()
    end`) + '<p>One <code>on</code> block per phase, at the top level of the program. A block ends at <code>end</code> or at the first line no further right than <code>on</code>. Inside, call nodes in the order they should run. Start(), FixedTick(), Tick(), Shutdown() can dispatch phases manually; avoid combining manual dispatch with a host that already owns those calls unless intentional. An uncaught <a href="#errors">Fail</a> ends the current phase and reports its message. <code>system Name on Phase</code> is no longer accepted; the error message points to the <code>on</code> form.</p>'),
    section('play-host','Running the play host', code(`python -m ouroboros play examples/game/engine_loop/ --frames 120
python -m ouroboros play examples/game/vk_scene/ --native --vulkan --frames 0`, 'Terminal','shell') + '<p><code>--frames 0</code> means unlimited host frames. Native Vulkan play depends on the Windows graphics/toolchain setup. <code>--watch</code> rebinds/relaunches on source changes; it is not a guarantee of state-preserving hot reload.</p>'),
    section('clocks','Clocks and shutdown','<p>Dt() is frame duration, FixedDt() the configured simulation step, Time() elapsed host time. Quit() requests host termination. Inputs, audio pumping, presentation and final heap teardown follow host lifecycle rules. Avoid allocating new heap objects on every hot update when stable data/views will do.</p>')
  ]);

  add('rendering','Engine guide','Rendering & materials','The RHI surface, offline recording, and Vulkan presentation.',[
    section('rhi-model','A command-oriented surface','<p>Game-facing Draw/Upload/SetCamera calls lower to a shared ouro_rhi_* ABI. Offline software support records slots and counters; the Vulkan host supplies presentation. A recorded draw or occupied slot is not proof that a live asset decoded successfully or a frame was visible.</p>'),
    section('camera-primitives','Cameras and primitives', code(`SetClearColor(0.08, 0.1, 0.12)
SetCamera3D(0.0, 3.0, 8.0, 0.0, 0.0, 0.0, 60.0)
DrawPlane(0.0, 0.0, 0.0, 10.0, 10.0, 0.3, 0.4, 0.3)
DrawBox(0.0, 1.0, 0.0, 0.5, 0.5, 0.5, 0.7, 0.8, 0.5)`) + '<p>DrawBox uses position, half-extents and RGB. DrawPlane uses position, X/Z half-extents and RGB. SetCamera is the 2D offset/zoom path. SetOrbitCamera uses degrees for yaw and a seven-scalar host signature; check existing scene examples for parameter ordering.</p>'),
    section('meshes','Mesh submission','<p>UploadMesh/UploadMeshIndexed select demo mesh paths. UploadMeshData(id, array) accepts interleaved XYZ + RGB f64 data. DrawMesh submits a slot; DrawAt sets 2D placement. ClearDrawList clears issued draws; DrawEntities bridges entity columns to draws. Current mesh slots and command capacities are finite.</p>'),
    section('materials','Lighting and materials', code(`SetMaterial(0, 0.7, 0.8, 0.5, 0.6, 0.0)
UseMaterial(0)
SetAmbient(0.15, 0.15, 0.15)
SetDirLight(0.0, -1.0, -0.5, 1.0, 1.0, 1.0)`) + '<p>Six material arguments are slot, base RGB, roughness and metallic. UseMaterial(-1) returns to per-draw colors. Directional light specifies travel direction plus RGB. Lighting uses ambient + Lambert + Blinn–Phong; this is not a complete physically based render pipeline.</p>'),
    section('render-queries','Queries and limits','<p>RhiDrawCount, RhiPrimCount, RhiMeshVerts, RhiMeshUsed, RhiMaterialUsed and RhiLitPrimCount support offline assertions. RhiShadeProbe returns luminance ×100 or -1 for invalid probes. Render graphs, explicit GPU lifetime tracking, shadows, skeletal animation and advanced GPU tooling remain engine milestones.</p>')
  ]);

  add('media-ui','Engine guide','Textures, fonts, input & UI','Pixels, asset slots, and testable immediate-mode widgets.',[
    section('textures','Textures and atlases', code(`let Texture = LoadTexture("sprite.png")
BindTexture(Texture)
SetTint(1.0, 1.0, 1.0)
DrawTexturedQuad(20.0, 20.0, 64.0, 64.0)
SetAtlasGrid(4, 4)
DrawAtlasCell(1, 2, 100.0, 20.0, 64.0, 64.0)`) + '<p>Live texture loading supports formats described in the examples (.rgba/BMP/PNG). Atlas calls select a grid cell. Texture/font capacity is finite; current slot conventions reserve high slots for fonts/HUD/white pixels. RhiTexUsed/RhiFontUsed can mean “requested,” not successfully decoded.</p>'),
    section('fonts','Fonts and text','<p>LoadFont prepares a font atlas on supported live backends; DrawText(x, y, text) issues text with string arguments. DebugHud provides diagnostic text/quads. Offline RHI counts requests; it is not a font shaping, Unicode layout or keyboard text-editing engine.</p>'),
    section('input','Keyboard and mouse', code(`if (KeyDown("Escape"))
    Quit()
end
let Horizontal = Axis("Horizontal")
let X = MouseX()
let Down = MouseDown("Left")`) + '<p>Keys accept conventional names (arrows, Space, Escape, Shift, Ctrl, Enter, Tab) or single-character keys. Axis has Horizontal/Vertical mappings. Mouse coordinates are client pixels, top-left origin. Offline keys/axes default to zero; SimMouse can drive deterministic pointer tests.</p>'),
    section('widgets','Immediate-mode UI', code(`mut Value = 0.5
mut Checked = false
UiBegin()
UiPanel(10.0, 10.0, 260.0, 150.0)
UiLabel(20.0, 20.0, "Settings")
Value = UiSlider(20.0, 50.0, 180.0, Value, 0.0, 1.0)
Checked = UiCheckbox(20.0, 85.0, "Enabled", Checked)
if (UiButton(20.0, 115.0, 100.0, 24.0, "Quit"))
    Quit()
end
UiEnd()`) + '<p>Widget IDs follow call order per frame. A button activates on release over the pressed widget. Sliders update while held. UiWidgetCount counts calls since UiBegin. Keep call order stable; keyboard focus, complex text layout and a production editor UI are not completed.</p>')
  ]);

  add('audio','Engine guide','Sound & streaming music','Know the difference between the soft test model and live audio.',[
    section('sound','Sound effects', code(`let Sound = LoadSound("click.wav")
if (SoundLoaded(Sound))
    SetSoundVolume(Sound, 0.5)
    SetSoundPan(Sound, 0.0)
    PlaySound(Sound)
end`) + '<p>Offline audio reads WAV metadata without producing sound; native play uses XAudio2. LoadSound allocates a finite ID even for missing/invalid files. SoundLoaded tells whether decoding succeeded. SoundPlaying and AudioPlayCount expose state.</p>'),
    section('music','Streaming music', code(`MusicPlay("music.wav", true)
MusicVolume(0.4)
// Under play, the host pumps audio after Tick.
// Offline tests can call AudioPump() explicitly.`) + '<p>The current path streams one WAV using four 64 KB buffers. MusicStop ends playback; MusicPlaying/MusicBytes report state. The soft model has deterministic pump/refill behavior for goldens. Broad codec support, overlapping voice/mixing behavior and platform audio coverage remain limited.</p>'),
    section('audio-assets','Asset paths and failure','<p>Resolve audio relative to the source/launch folder established by play/run. Check SoundLoaded rather than interpreting any nonzero ID as valid data. Use existing demo WAV tooling in the repository when testing; do not expect arbitrary compressed audio to decode.</p>')
  ]);

  add('physics','Engine guide','Physics, PhysX, Flow & Blast','Two different physics surfaces with explicit backend choices.',[
    section('box-world','Built-in box world', code(`PhysGravity(0.0, -9.81, 0.0)
let Floor = BodyBox(0.0, -1.0, 0.0, 10.0, 0.5, 10.0, 0.0)
let Box = BodyBox(0.0, 3.0, 0.0, 0.5, 0.5, 0.5, 1.0)
PhysStep(0.0166666667)
Print(Int(BodyY(Box) * 100.0))`) + '<p>BodyBox takes XYZ, half-extents, and mass; mass zero is static. BodySetVel updates dynamic velocity, BodySetPos teleports while retaining velocity. BodyRestitution controls bounce. Queries expose position, velocity, contact count and world count.</p>'),
    section('physics-model','Solver limits','<p>PhysStep subdivides at approximately 1/120 s, uses swept AABB time of impact and caps impacts per substep. Pair response uses masses/restitution. Already-overlapping boxes do not receive a general push-out; there is no rotating-body solver or friction. Use the model as a box-world foundation, not a full rigid-body engine.</p>'),
    section('physx','Optional PhysX stack','<p>Px*, Flow* and Blast* have a catalogued ABI. Without --physx, calls may link a stub. With --physx, selection prefers a configured SDK backend when available or software fallback. These are not interchangeable guarantees of NVIDIA feature completeness.</p>' + code('python -m ouroboros play examples/game/physx_engine/ --native --vulkan --physx --frames 0','Terminal','shell') + '<p>The reference includes every catalogued name and argument kind. Check PxIsReady/FlowIsReady/BlastIsReady and the selected host backend. Software implementations and stub semantics are deliberately more limited than the corresponding vendor technologies.</p>'),
    section('aabb','Gameplay AABB helpers','<p>OverlapsAABB takes two 2D boxes as eight scalars. ResolveAABB writes separation outputs through named out parameters. Output parameters must be valid names and their conventions are specific to that API; they are not general reference-return syntax.</p>')
  ]);

  add('assembly','Tooling & internals','Inline assembly','x64 MASM snippets that reach Ouro variables by name.',[
    section('asm-block','ASM blocks', code(`N := 10
@ASM
{
    mov rax, {N}
    add rax, 5
    mov {N}, rax
}
N -> Print`, 'Prints 15') + '<p>An <code>@ASM { … }</code> block is x64 MASM placed where the block appears, at the top level or inside a function. <code>{Name}</code> is the memory operand of that variable: a global, a parameter or a local. It always names a qword in memory (for a struct, its first qword), never a register, and the value written there is what Ouro reads next. A name the checker does not know is an error at the <code>@ASM</code> line, with a spelling suggestion.</p>'),
    section('asm-data','Data and calls', code(`@ASM
{
.data
    _k dq 27
.code
    mov rax, qword ptr [_k]
    add {N}, rax
}`) + '<p>A snippet may switch to <code>.data</code> for constants and must return to <code>.code</code>. <code>extrn</code> declarations are allowed. At a snippet rsp is 16-byte aligned with 32 bytes of shadow space, so a Win64 call can be made directly.</p><p>A file that contains nothing but one @ASM block is a complete MASM program instead: it defines its own <code>main proc</code>, and the x64 build assembles it as written and links it against kernel32 with <code>main</code> as the entry point. <code>{Name}</code> has no meaning there. Write console output with <code>WriteFile</code> rather than <code>WriteConsoleA</code> if the program may run with redirected output.</p>'),
    section('asm-contract','The register contract', table(['Rule','Why'],[['Preserve rbx, rbp, rdi, rsi, rsp, r12–r15 and xmm6–xmm15','The register allocator keeps Ouro values in callee-saved registers across a snippet.'],['rax, rcx, rdx, r8–r11 and xmm0–xmm5 are free','A snippet counts as a call; nothing caller-saved is live across it.'],['Copy by-ref parameters and entity elements into a local first','<code>{Name}</code> must name storage; by-ref parameters are rejected.'],['Do not jump out of a snippet','Control flow must fall through to the next statement.']]) + code(`each Player
    H := Health
    @ASM
    {
        add {H}, 5
    }
    Health := H
end`, 'Working on an entity element')),
    section('asm-backends','Backends and errors','<p>@ASM needs the x64 backend. <code>--backend auto</code> picks x64 for a program with an @ASM block, <code>--backend c</code> reports “@ASM block needs --backend x64”, and <code>play --native</code> builds such programs with x64. The interpreter skips @ASM blocks, so these programs are compared against their expected output on x64 only.</p><p>Each snippet is preceded by a <code>; ouro src L&lt;n&gt;</code> marker. An ml64 error inside a snippet is reported as <code>error: N:1: (ml64 L…)</code> at the @ASM line, and an unresolved symbol at link time as <code>error: N:1: (link): …</code>.</p>' + note('Not portable code','Snippets are Win64 MASM. Keep them small and test them on x64; runtime internals (heap layout, ouro_rt_* symbols) are not a stable interface.',true))
  ]);

  add('backends','Tooling & internals','Compiler & backends','Preparation, typed IR, generated C, and Win64 assembly.',[
    section('pipeline','The compilation pipeline','<p>Parse → prepare_program (resolve imports/includes, templates and specializations without running the program) → gradual checking → interpreter or typed IR lowering. IR functions contain blocks and SSA virtual registers; a verifier checks structure/types. Unsupported lowering reports the construct instead of silently pretending it is covered.</p>'),
    section('backend-selection','Backend selection', table(['Backend','Meaning','Platform'],[['auto','C when the typed IR covers the program and a C compiler is found; x64 when the program has an @ASM block; otherwise legacy. stderr names the pick and any fallback reason.','Depends on the pick'],['c','Typed IR → C + portable refcounted runtime','Windows (cl) and Linux / WSL (gcc / clang)'],['x64','Typed IR → MASM with frames, register allocation and the same runtime; the only backend for @ASM','Win64'],['wasm (<code>build --wasm</code>)','Typed IR → C → WebAssembly (LLVM clang + wasm-ld) with the same runtime over a browser platform layer; loaded by ouro.js','Any browser; Node for tests'],['legacy','Original MASM lowering, slated for removal. Rejects the newer syntax (arrows and flows, nodes, ranges, on blocks).','Windows']]) + code('python -m ouroboros run main.ouro --backend c\npython -m ouroboros dump-ir main.ouro','Terminal','shell') + '<p>Every program the IR backends cover must print exactly what the interpreter prints; the regression harness enforces this for C and x64 on every covered case. Of the regression programs, the IR backends cover all but the error-reporting cases (which are rejected on purpose) and one pattern: inside <code>each</code>, a function called from the loop that names a full column (<code>Player_Health</code>) meaning the current element.</p>'),
    section('runtime-layout','Two memory models','<p>Interpreter/legacy paths use the project’s rotator/size-class heap model. IR strings/arrays/maps/dynamic boxes use a portable refcounted runtime with copy-on-write and immortal literals. Explicit systems allocation is a separate layer. Historical “no Alloc/Free” notes refer to the old automatic value heap, not the newer systems builtins.</p>'),
    section('abi','Native implementation','<p>The x64 backend uses Win64 argument/return conventions, frame alignment, preserved callee registers, stack probing and linear-scan allocation. The C backend delegates native optimization to the installed compiler. An engine ABI wrapper catalog does not yet provide general-purpose user-declared FFI.</p>')
  ]);

  add('cli','Tooling & internals','Command-line reference','Build, inspect, check, watch, and test a project.',[
    section('commands','Commands', table(['Command','Purpose'],[['<code>python -m ouroboros compile file.ouro [flags]</code> (same options apply to <code>python -m ouroboros file.ouro</code>)','Prepare/lower; add --build or --run for native output/execution.'],['<code>… build file.ouro</code>','Compile and link.'],['<code>… run file.ouro</code>','Compile, link and execute.'],['<code>… play file.ouro|dir/</code>','Run the engine phase host.'],['<code>… check file.ouro --types</code>','Diagnostics and inferred types.'],['<code>… dump-ir file.ouro</code>','Verified IR or unsupported-construct reason.'],['<code>… dump-ast file.ouro</code>','AST inspection.'],['<code>… fmt file.ouro</code>','Currently AST/statement summary—not a source-rewriting formatter.'],['<code>… watch file.ouro</code>','Poll dependencies and rebuild/run.'],['<code>… build file.ouro --wasm [--out DIR]</code>','WebAssembly for the browser: DIR/app.wasm, ouro.js and an index.html to start from (needs LLVM; see <a href="#browser">Ouro in the browser</a>).'],['<code>… serve [dir | app.ouro | --build build.ouro] [--port N] [--native] [--no-open]</code>','Development web server with live reload: serve a folder, rebuild a site on every change, or run and restart a server program (see <a href="#web/web-dev">the dev server</a>).'],['<code>… repl</code>','Persistent line-oriented interpreter.'],['<code>… lsp</code>','Language server over stdio.']])) ,
    section('flags','Common options','<p>The default compile command supports <code>--backend auto|c|x64|legacy</code>, <code>--build</code>, <code>--run</code>, <code>--no-check</code>, and PhysX/toolchain options. Play adds <code>--native</code>, <code>--vulkan</code>, <code>--physx</code>, <code>--frames</code>, <code>--watch</code>, timing controls and a backend choice for native play. Use <code>python -m ouroboros --help</code> and <code>python -m ouroboros play --help</code> for the authoritative current flags.</p>'),
    section('run-behaviour','How run and build behave','<p><code>build</code> and <code>run</code> compile the program without executing it first, so servers and programs that write files run exactly once. <code>run</code> starts the executable in the script’s folder and attaches it to your terminal: output appears as it is printed, input can be typed or piped, and Ctrl+C stops it. The interpreter only runs when the legacy backend is needed or when you ask for the report (no <code>--build</code> / <code>--run</code>).</p>'),
    section('artifacts','Outputs and exit codes','<p>Native artifacts are written under build, with backend-specific generated source and executable outputs. Exact generated files depend on the selected backend and build mode. Compile/build errors return a nonzero status; run behavior propagates/report program failure. Check the CLI output and the build directory rather than relying on one fixed artifact set.</p>'),
    section('regressions','Regression commands', code(`python -m ouroboros.bug_tests --interp-only
python -m ouroboros.bug_tests --c-only --run-timeout 30
python -m ouroboros.bug_tests struct_nested engine_math
python -m unittest discover -s tests -p 'test_*.py'
python tests/perf/run_engine_perf.py --runs 7`, 'Terminal','shell') + '<p>The bug harness compares expected output and backend/interpreter parity. <code>--c-only</code> compares interpreter against C/x64 IR backends; <code>--no-x64</code> excludes x64. Use <code>python -m ouroboros.bug_tests --help</code> for the current options. .no_legacy cases require IR coverage. --run-timeout bounds native executable execution, not every build or interpreter phase.</p>')
  ]);

  add('editor','Tooling & internals','Editor & diagnostics','Make the language visible while you work.',[
    section('vscode','VS Code integration','<p>The repository contains a VS Code extension under editors/vscode for .ouro/.var/.ent/.nod grammar (including the arrow operators, <code>node</code> and <code>on</code> blocks) and a language-server client. It is a local extension source, not a promise of marketplace distribution. Configure ouroboros.pythonPath and ouroboros.serverCwd to locate Python and the package root.</p>'),
    section('lsp','Language server features','<p>The stdio LSP supports diagnostics, inferred-type hover, go-to-definition, document symbols and completion. Unsaved buffers feed preparation/checking. Dynamic inference and implicit side-file discovery influence what can be resolved; the LSP is not a complete refactoring/debug-adapter suite.</p>'),
    section('error-locations','Reading errors','<p>Front-end spans carry file/line/column information. Include chains identify both parent and child. Programs the checker rejects are also refused by the IR at the same line:col. Generated x64 assembly marks every @ASM snippet with <code>; ouro src L&lt;n&gt;</code>, so ml64 and link errors inside snippets map back to the @ASM line. Inspect dump-ir when the problem is backend coverage rather than syntax.</p>')
  ]);

  add('performance','Tooling & internals','Performance & measurement','Native compilation is a starting point, not a C-speed guarantee.',[
    section('perf-guidelines','Choose data representation deliberately','<p>Use fixed structs/slices for contiguous hot data, allocate outside inner loops, and avoid accidentally dynamic accumulators. Prefer statically predictable field arithmetic. General arrays/maps are convenient but introduce tagging, ownership and helper-call costs.</p>'),
    section('perf-measure','Run comparable workloads', code(`python tests/perf/run_engine_perf.py --runs 7 --json build/engine_perf/results_c.json
python tests/perf/run_engine_perf.py --backend x64 --runs 7
python tests/perf/run_perf.py`, 'Terminal','shell') + '<p>The engine runner validates checksums, warms executables and alternates run order. Current results measure whole-process startup + work + output. C references can vectorize and restructure loops; typed slice bounds checks remain enabled.</p>'),
    section('perf-results','Recorded development measurements', table(['Workload','C backend / optimized C time','x64 / optimized C time'],[['Scalar state updates','0.98×','0.95×'],['Contiguous particles','1.43×','2.33×'],['Float transforms','1.13×','1.91×'],['Job graph/wrapper','1.62×','1.76×']]) + '<p>Five-run medians recorded on Windows/MSVC 19.44 after statement-local checked-address reuse. Lower is better. These are not portable guarantees; small scalar differences can be noise. Job worker serialization is retained in the compared implementations.</p>'),
    section('perf-next','What to profile next','<p>Longer kernel-focused workloads, vectorization, hoistable bounds checks, allocation pressure, ECS churn, strings and safe parallel jobs are next targets. The saved JSON and ENGINE_FOUNDATION.md record caveats and current measurements. Do not advertise universal C parity or an Unreal-scale engine from these tests.</p>')
  ]);

  add('recipes','Reference','Worked examples','Small complete patterns you can adapt and test.',[
    section('recipe-counter','A reusable counter', code(`void Increment(N)
    N += 1
end
mut Count = 0
for I := 1 to 3
    Increment(Count)
end
Print(Count)`, 'Counter · expected output: 3')),
    section('recipe-inventory','Inventory with a missing-key default', code(`mut Bag = { coin: 10 }
Bag["coin"] += 5
let Potions = Get(Bag, "potion", 0)
Print(Bag["coin"])
Print(Potions)`, 'Inventory · expected output: 15, then 0')),
    section('recipe-typed-data','Typed particle updates', code(`struct Particle
    X: i64
    V: i64
end
let Raw = Alloc(SizeOf(Particle) * 2)
mut Items: Slice(Particle)
Items = MakeSlice(Raw, 2)
Items[0].X = 10
Items[0].V = 3
Items[0].X += Items[0].V
Print(Items[0].X)
Free(Raw)`, 'Typed memory · expected output: 13')),
    section('recipe-library','Use the engine math sample', code(`use "../examples/engine/math/mod.ouro"
Print(EngineLerp(2.0, 6.0, 0.25))
Print(EngineLength3(3.0, 4.0, 0.0))`, 'main.ouro in docs/ · expected output: 3.0, then 5.0') + '<p>Run <code>python -m ouroboros check docs/main.ouro</code> and <code>python -m ouroboros run docs/main.ouro --backend c</code>. The sample provides scalar math, not a production Vec/Mat/Quat package. EngineRoot uses a fixed Newton iteration count for modest positive values.</p>'),
    section('recipe-website','A website: generator plus server', code(`python -m ouroboros run examples/web/build.ouro   # pages/*.md -> public/*.html
python -m ouroboros run examples/web/serve.ouro   # http://127.0.0.1:8080/ + guestbook`, 'Terminal', 'shell') + '<p><code>examples/web/</code> is a complete small site: <code>layout.ouro</code> holds the shared HTML template and navigation, <code>build.ouro</code> converts a Markdown subset (headings, lists, code blocks, paragraphs) into pages, and <code>serve.ouro</code> serves the pages and a guestbook form that stores messages in a file and redirects after each post. See <a href="#web">websites and HTTP</a>.</p>'),
    section('recipe-testing','Find larger working projects','<p>Explore examples/game for UI, audio, physics and Vulkan scenes; examples/systems for ownership, traits and jobs; tests/bug/cases for narrow reproducible behavior. Compile with an explicit backend and read matching .expect/.no_legacy fixtures before assuming support.</p>')
  ]);

  add('api','Reference','Builtin API index','A searchable inventory derived from the current compiler catalogs.',[
    section('api-reading','How to read the reference','<p>Each entry names its family, known argument/return information, and implementation-level caveats. Engine signatures come from ABI tables; some have custom overloads or named out arguments. Gradual checker return types are inference hints, not proof of all runtime behaviors.</p>' + note('Inventory is not universal coverage','A callable name does not mean every backend implements every argument combination. Engine wrappers are not general FFI. PhysX/Flow/Blast can be stubs or software fallbacks. Read the linked guide before relying on a family.')),
    '<input id="api-filter" class="api-filter" type="search" aria-label="Filter builtin reference" placeholder="Filter by name, family, or behavior…"><p id="api-count" class="api-count"></p><div id="api-list"></div>'
  ]);

  add('syntax-reference','Reference','Syntax quick reference','A compact map of declarations, expressions, blocks, and keywords.',[
    section('syntax-table','Core forms', table(['Construct','Syntax'],[['Mutable / immutable','<code>mut X = expr</code> / <code>let X = expr</code>'],['Typed storage','<code>mut X: Type</code>'],['Assignment / compound','<code>X = expr</code> / <code>X += expr</code>'],['Block / procedure / return','<code>if (…) … end</code> / <code>void F(…) … end</code> / <code>return expr</code>'],['Value function','<code>fn F(…) … end</code>'],['Counted / iterable loop','<code>for I := A to B by Step … end</code> / <code>for X in A … end</code>'],['Switch','<code>switch X case A, B … else … end</code>'],['Record / struct / entity','<code>record R … end</code> / <code>struct S … end</code> / <code>entity E … end</code>'],['Enum','<code>enum E … end</code>'],['Phase block','<code>on Tick … end</code> (one per phase)'],['Typed binding','<code>speed i32 := 5</code> / <code>X: i32 := 5</code>'],['Write a top-level name from a function','<code>global Score</code> (first line of the body)'],['Step','<code>count++</code> / <code>count--</code>'],['Range / range slice','<code>a..b</code> / <code>S[a..b]</code> (inclusive)'],['Flow / funnel','<code>x -&gt; F -&gt; G</code> / <code>a, b &gt;- F</code>'],['Conditional flow / loop','<code>x -[c]-&gt; F</code> / <code>~[c]~&gt; Body</code>'],['Iterate / filter','<code>xs ~&gt; F</code> / <code>xs ~[It &gt; 0]~&gt; F</code>'],['Match chain','<code>x -[ 1 -&gt; "one" | -&gt; "other" ]-&gt; F</code>'],['Store / catch / reactive','<code>x -&gt; Var</code> / <code>f ?-&gt; Handler</code> / <code>Q -|&gt; chain</code>'],['Node','<code>node N In[A i32] Out[R] … end</code>'],['Interpolation / multi-line text','<code>"$Name ${Len(X)}"</code> / <code>"""…"""</code>'],['Fail','<code>Fail("msg")</code> / <code>"msg" -[c]-&gt; Fail</code>'],['Trait / impl','<code>trait T … end</code> / <code>impl S: T … end</code>'],['Pointer / address / deref','<code>*T</code> / <code>&amp;V</code> / <code>(*P).Field</code>'],['Generic application','<code>Pair(i32)</code> / <code>Identity(i32)(value)</code>'],['Import / include / export','<code>use "path"</code> / <code>include "path"</code> / <code>export A, B</code>'],['Array / singleton / map','<code>[a,b]</code> / <code>[a,]</code> / <code>{ key: value }</code>'],['Entity iteration','<code>each P in Player where condition … end</code>'],['Inline assembly (x64)','<code>@ASM { add {N}, 5 }</code>']])) ,
    section('keyword-list','Keywords','<p>if · elseif · else · end · void · while · for · to · in · entity · record · struct · enum · trait · impl · each · where · break · continue · fn · return · use · include · switch · case · export · node · on · and · or · by · then · with · mut · let · as · system</p><p><code>global</code> is a statement word only at the start of a line followed by names (<code>global A, B</code>), so a variable called <code>Global</code> still works. <code>system</code> is still reserved so the old <code>system Name on Phase</code> form gets a pointed error. Type names and builtin names are separate from this keyword list. Keywords are matched case-insensitively, so <code>In</code> and <code>On</code> are keywords too (node ports accept <code>In</code>).</p>'),
    section('traps','Common syntax traps','<ul><li><code>[x]</code> is absolute value; use <code>[x,]</code> for one array element.</li><li>Use spaces around subtraction. The lexer can tokenize a minus immediately before digits as a negative literal.</li><li>Prefix <code>*</code> is dereference; infix <code>*</code> is multiplication.</li><li><code>^</code> belongs to math-power or condition-XOR parsing depending on context.</li><li><code>??</code> is falsy coalescing, not null-only coalescing.</li><li><code>fmt</code> prints an AST summary; it does not rewrite source.</li><li><code>a &gt;-1</code> is a funnel; write <code>a &gt; -1</code> for a comparison.</li><li><code>-[x]</code> and <code>~[x]</code> open arrow conditions; write <code>- [x]</code> for minus-absolute-value.</li><li><code>A, B -&gt; F</code> is an error; several inputs use <code>A, B &gt;- F</code>.</li><li><code>[50, 99] ~&gt; F</code> at the start of a statement reads as a tag gate; bind the array to a name first.</li></ul>')
  ]);

  const FEATURES = [
    ['@ASM snippet','@ASM { add {N}, 5 }',X64,'assembly'],['@ASM whole-file program','a file that is one @ASM block',X64,'assembly'],
    ['Absolute value','[x]',ALL,'operators'],['Address-of','&V',ALL,'pointers'],['AddComp / HasComp / RemoveComp','AddComp(E, Shield, 5)',ALL,'ecs'],['Alloc / Free','P := Alloc(64)',ALL,'pointers'],['Append / Exists / Delete / JoinPath','Append(path, text)',ALL,'io'],['Arenas','ArenaNew / ArenaAlloc / ArenaReset / ArenaDestroy',ALL,'ownership'],['Array literal','[1, 2]  [7,]  []',ALL,'collections'],['Array element write','A[i] := v   A[i] += 1',ALL,'collections'],['Array range literal','[1 to 5]',ALL,'collections'],['Array push / pop / insert / clear','Push(A, v)',ALL,'collections'],['Arrow flow','x -> F -> G',ALL,'pipes'],['Arrow store','x -> Name   x -> A.B   x -> A[i]',ALL,'pipes'],['as-stage','x -> as Name',ALL,'pipes'],['AsDyn / dynamic trait values','AsDyn(Draw, &Shape)',ALL,'generics-traits'],['Atomics','AtomicI64, AtomicAdd, AtomicCas',ALL,'concurrency'],['Audio and music','LoadSound, PlaySound, MusicPlay',ALL,'audio'],
    ['Backends','--backend auto | c | x64 | legacy','—','backends'],['Bitwise builtins','BitAnd BitOr BitXor Shl Shr',ALL,'operators'],['BitCast','BitCast(*T, P)',ALL,'pointers'],['Block comments','(none; use // per line)',NOTYET,'lexical'],['Booleans','true  false',ALL,'types'],['Box physics','BodyBox, PhysStep, BodyY',ALL,'physics'],['break / continue','break   break Outer   continue',ALL,'control-flow'],['Buf byte spans','MakeBuf, BufLen, BufSlice',ALL,'slices'],['By-ref parameters','void Inc(N) N += 1 end',ALL,'functions'],
    ['Catch','f ?-> Handler',ALL,'errors'],['Characters','\'A\'  \'\\n\'',ALL,'lexical'],['Checker','python -m ouroboros check file.ouro --types','—','types'],['Clamp / Min / Max / Abs / Sign / Sqrt / Rand','Clamp(X, 0, 9)',ALL,'operators'],['Comments','// text',ALL,'lexical'],['Comparisons','== != < > <= >=',ALL,'operators'],['Compound assignment','+= -= *= /= %=',ALL,'bindings'],['Compound (classic spelling)','Hp := + 1',ALL,'bindings'],['Conditional flow','x -[c]-> F',ALL,'pipes'],['Condition logic','&& || and or & | ^ ! ~',ALL,'operators'],['Constant binding','Limit =: 100',ALL,'bindings'],['Copy / Fill','Copy(dst, src, n)',ALL,'slices'],
    ['Defaults for parameters','fn Scale(V, F := 2)',ALL,'functions'],['Dereference','*P   (*P).X   P.X',ALL,'pointers'],['Despawn / DespawnById','Despawn(E, slot)',ALL,'ecs'],['Directory as program','python -m ouroboros run game/','—','project-files'],['Dt / FixedDt / Time / SetFixedDt / Quit','SetFixedDt(0.016)',ALL,'engine-loop'],
    ['each (binder form)','each P in Player where P.Hp > 0 … end',ALL,'ecs'],['each (ambient form)','each Player … Health … Id … end',st('part','see limits'),'ecs'],['each over several entities','each A, B … end',ALL,'ecs'],['Empty-left flow','-> F   -[c]-> F',ALL,'pipes'],['Entity archetype','entity Player … end',ALL,'ecs'],['Entity flow','Player ~> Update   Player ~[Hp < 5]~> Heal',ALL,'ecs'],['Entity lookup','FindId(E, id)   Enemy@10',ALL,'ecs'],['enum','enum State … end   Idle := 3',ALL,'records'],['export','export ScaleUp',ALL,'modules'],
    ['Fail','Fail("msg")   "msg" -[c]-> Fail',ALL,'errors'],['File text I/O','Read(path)   Write(path, text)',ALL,'io'],['File binary I/O','ReadBin / WriteBin',ALL,'io'],['Float literals','1.5  2e3  1.5f  0.1f64',ALL,'lexical'],['Floor / ceiling','{x}  ⌊x⌋  ⌈x⌉',ALL,'operators'],['fn functions','fn F(X) … return X end',ALL,'functions'],['for … to … by','for I := 10 to 1 by -1',ALL,'control-flow'],['for … in','for X in Arr   for K, V in M',ALL,'control-flow'],['Funnel','a, b >- F',ALL,'pipes'],
    ['Generics','struct Pair(T)   fn Id(T)(X: T)',ALL,'generics-traits'],['global','global Score, Lives',ALL,'bindings'],['Get with default','Get(M, "k", 0)',ALL,'collections'],['Has / Del / Keys / Values','Has(M, potion)',ALL,'collections'],['Hex / binary literals','(none)',NOTYET,'lexical'],
    ['if / elseif / else','if c … elseif d … else … end',ALL,'control-flow'],['if-expression','if c then a else b',ALL,'operators'],['include','include "systems.ouro"',ALL,'modules'],['Inclusive range','a..b',ALL,'operators'],['Inclusive slice','S[a..b]   Arr[a..b]',ALL,'operators'],['Input / InputNorm','Line := InputNorm()',ALL,'io'],['Integer literals and suffixes','42  42i32  7u8',ALL,'lexical'],['Interpolation','"Hp: $Hp"   "${Name}"   "$$"',ALL,'strings'],['Iterate / map','D := Nums ~> Double',ALL,'pipes'],['Iterate with filter','Nums ~[It > 2]~> F',ALL,'pipes'],
    ['Job queues and graphs','JobQueueNew, JobSpawnAfter',ALL,'concurrency'],['Keywords','if … end … node on …','—','syntax-reference'],['Labeled loops','Outer: while … break Outer',ALL,'control-flow'],['Loop arrow','~[c]~> Body',ALL,'pipes'],['Maps','{ gold: 10 }   M["k"] := v',ALL,'collections'],['Match chain','x -[ 1 -> "one" | -> "other" ]-> F',ALL,'pipes'],['Multi-value case / case range','case "a", "b"   case 1 to 5',ALL,'control-flow'],['Mutable binding','X := v   mut X = v',ALL,'bindings'],['Mutexes','MutexNew, MutexLock',ALL,'concurrency'],
    ['Node','node N In[A i32] Out[R] …',ALL,'nodes'],['Node categories','Physics.Damage',ALL,'project-files'],['Null-ish coalescing','x ?? y',ALL,'operators'],['on phase blocks','on Start / FixedTick / Tick / Shutdown',ALL,'engine-loop'],['Own / Rc','OwnNew, RcNew, RcClone, Drop',ALL,'ownership'],['Phase calls','Start()  Tick()',ALL,'engine-loop'],['PhysX / Flow / Blast','PxInit, FlowInit, BlastInit',st('part','optional'),'physics'],['Pipe sequence','A() => B()',ALL,'pipes'],['Play host','python -m ouroboros play dir/ --frames 0','—','engine-loop'],['Pointers','*T',ALL,'pointers'],['Power / root','2 ^ 8   √x',ALL,'operators'],['Print','Print(a, b)   x -> Print',ALL,'io'],
    ['Reactive binding','Q -|> Double -> R',ALL,'pipes'],['record','record Hero … end   Hero{}   NewRecord(Hero)',ALL,'records'],['Record fields','H.Health   GetField   SetField',ALL,'records'],['Record conversion','ToMap / Pack / Unpack / Clone',st('part','see limits'),'records'],['Recursion','fn Fib(N) … Fib(N - 1) …',ALL,'functions'],['Rendering','SetCamera3D, DrawBox, SetMaterial',ALL,'rendering'],['return','return value',ALL,'functions'],
    ['Slice(T) typed views','MakeSlice, SubSlice, S[i].F',ALL,'slices'],['Slice of text (end-exclusive)','Slice(S, 0, 3)',ALL,'strings'],['Spawn','Spawn(Player)',ALL,'ecs'],['Step','count++   count--',ALL,'bindings'],['String functions','Trim, ToUpper, Contains, Replace, Split, Join',ALL,'strings'],['String literals and escapes','"a\\tb\\n"   "\\x41"',ALL,'lexical'],['struct','struct Vec3 X f32 … end',ALL,'structs'],['SizeOf / AlignOf / OffsetOf','SizeOf(Vec3)',ALL,'structs'],['Subject gate','x -> [It > 0] F',ALL,'pipes'],['switch','switch X case … else … end',ALL,'control-flow'],['system Name on Phase','(removed; use on blocks)',st('no','removed'),'engine-loop'],
    ['Tag gate','[Health < 5] -> Alert()',ALL,'control-flow'],['Textures, fonts, input, UI','LoadTexture, DrawText, KeyDown, UiButton',ALL,'media-ui'],['then / else stage','x -> then A else B',ALL,'pipes'],['Threads','SpawnThread, JoinThread',ALL,'concurrency'],['trait / impl','trait Draw … end   impl Circle: Draw',ALL,'generics-traits'],['Type annotation','speed i32 := 5   X: i32 := 5',ALL,'bindings'],['Type-name conversion','i32(X)   X -> i32',NOTYET,'types'],['Typed save','Write(p, M)   Read(p, Hero)',ALL,'io'],
    ['UFCS method calls','Words.Len()   Inv.Has(k)',ALL,'functions'],['Unicode operators','× ÷ √',ALL,'lexical'],['use','use "lib/"   use "x.var"',ALL,'modules'],['.var / .ent / .nod side files','world.var  player.ent  Physics.nod',ALL,'project-files'],['void procedures','void Log(M) … end',ALL,'functions'],['while','while c … end',ALL,'control-flow'],['with','with S := FindId(E, id) … end',ALL,'control-flow'],['World save','SaveWorld(E, path)   LoadWorld(E, path)',ALL,'ecs'],
    ['Multi-line strings','"""…"""',ALL,'strings'],['Interpolated expressions','"${Len(Items)} items"',ALL,'strings'],['Folders: ListDir / IsDir / MakeDir / CopyFile','ListDir("pages")',ALL,'web'],['HTML / URL escaping','HtmlEscape(T)  UrlEncode(T)  UrlDecode(T)',ALL,'web'],['Open in browser','OpenUrl("public/index.html")',ALL,'web'],['HTTP server','HttpListen / HttpListenPublic / HttpAccept / HttpRespond',ALL,'web'],['HTTP request data','HttpMethod  HttpPath  HttpQuery  HttpForm  HttpHeader  HttpBody',ALL,'web'],['HTTP response headers','HttpSetHeader(R, "Cache-Control", "no-store")',ALL,'web'],['HTTP client (http:// and https://)','HttpGet  HttpPost  HttpRequest(method, url, body, headers)',ALL,'web'],['HTTP response data (client)','HttpStatus()  HttpResponseHeader(name)  HttpError()',ALL,'web'],['File uploads','HttpFile(R, "photo")  HttpFileName  HttpFileType',ALL,'web'],['Many connections / keep-alive','HttpAccept (event loop)',ALL,'web'],['Routes','RouteMatch("/users/:id", P)  RouteParams(…)',ALL,'web'],['Cookies','HttpCookie(R, "id")  HttpSetCookie(R, "id", V, "Path=/")',ALL,'web'],['Redirects','HttpRedirect(R, "/done")',ALL,'web'],['Static files with caching','HttpRespondFile(R, "public" + Path)',ALL,'web'],['JSON','ToJson(V)  ToJsonPretty(V)  FromJson(T)',ALL,'web'],['JSON paths','JsonGet(T, "a.b[0]")  JsonHas  JsonType  JsonLen',ALL,'web'],['Dates and times','Now()  FormatTime(T, "%F")  ParseTime  TimeIso  MakeTime',ALL,'web'],['Templates','RenderTemplate("page.html", Data)  {{#each}}',ALL,'web'],['Markdown','Markdown(T)  MarkdownSafe(T)',ALL,'web'],['Query strings','UrlQuery({"q": "a b"})',ALL,'web'],['Environment variables','Env("PORT")',ALL,'web'],['File size / time','FileSize(P)  FileTime(P)',ALL,'web'],['Sleep','Sleep(250)',ALL,'web'],['Dev server with live reload','python -m ouroboros serve --build build.ouro','—','web'],['HTTPS server','HttpListenTls(443, "cert.pem", "key.pem")',ALL,'web'],['WebSockets','WsUpgrade(R)  WsSend(W, text)  HttpMethod(R) == "WS"',ALL,'web'],['SQLite database','DbOpen  DbExec(Db, sql, {})  DbQuery  DbLastId',ALL,'web'],['Ouro in the browser (WebAssembly)','python -m ouroboros build app.ouro --wasm',st('ok','interp · C · x64 · wasm'),'browser'],['DOM builtins','DomSetText  DomGetValue  DomOn(sel, "click", F, N)',st('ok','page · simulated elsewhere'),'browser'],
    ['Handbook items not yet built','.com / .dom files, ownership arrows, >~ folds, ~>>',NOTYET,'limitations']
  ];
  const letters = [...new Set(FEATURES.map(f => (f[0].match(/[A-Za-z]/) || ['#'])[0].toUpperCase()))].sort();
  add('feature-index','Reference','Feature index (A–Z)','Every construct in the language with its syntax, where it runs, and the page that explains it.',[
    section('fi-legend','Reading the index', `<p>${ALL} runs in the interpreter and on the C and x64 backends with identical output. ${X64} needs the x64 backend. ${st('part','see limits')} works with a documented restriction. ${NOTYET} is not available; the row names what to use instead. Builtin functions have their own <a href="#api">API index</a>.</p><div class="letter-jump">${letters.map(l => `<a href="#feature-index/fi-${l}">${l}</a>`).join('')}</div>`),
    ...letters.map(l => section(`fi-${l}`, l, table(['Feature','Syntax','Status','Guide'], FEATURES.filter(f => (f[0].match(/[A-Za-z]/) || ['#'])[0].toUpperCase() === l).sort((a, b) => a[0].localeCompare(b[0])).map(f => [f[0], C(f[1]), f[2], `<a href="#${f[3]}">{{title:${f[3]}}}</a>`]))))
  ]);

  add('limitations','Reference','Compatibility & known limitations','Make backend and safety assumptions visible before shipping.',[
    section('compatibility-policy','Backend policy','<p>The C/x64 paths share typed IR and runtime operations; legacy MASM remains a separate implementation that does not accept the newer syntax and is slated for removal. Explicit --backend selection avoids surprising fallback. Check individual programs with dump-ir and focused regression tests. Some historic docs still list features as legacy-only even though newer IR lowering exists.</p>'),
    section('known-gaps','Known gaps', table(['Area','Current limitation','Recommendation'],[['Nested systems fields','Interpreter/C/x64 covered; legacy paths unreliable','Use C/x64.'],['Numeric Print','Direct division expressions can misprint/fail on legacy','Use IR; test precision and bind results where necessary.'],['Fractional power','Existing ^ paths truncate exponent','Do not use x ^ 0.5 as sqrt.'],['Unicode','Bytes vs characters and ASCII casing differ by path','Use ASCII parity tests; do not assume grapheme APIs.'],['Ownership','No complete borrow/lifetime checker','Test moves, drops, aliases and arena lifetimes.'],['Foreign libraries','Engine wrappers exist; general declared FFI remains open','Do not advertise arbitrary native-library integration.'],['Systems functions','Typed local/whole-struct value support is restricted','Use tested pointer/slice patterns and inspect IR coverage.'],['Engine assets','Finite slots and simple file/world formats','Check decode/readiness; design a production pipeline separately.'],['Reactive bindings','Element, field and by-ref parameter writes do not rerun a <code>-|&gt;</code> chain','Write the whole value (or <code>-&gt; Q</code>) when dependents must update.'],['Each aliasing on C/x64','A function called from <code>each</code> that names a full column (<code>Player_Health</code>) means the element in the interpreter but the column on the IR; auto falls back to legacy','Pass the element or slot as an argument.'],['Inline assembly','x64 only; snippets are Win64 MASM','Keep snippets small and follow the register contract.'],['Local shadowing a global','A function that assigns a fresh name which also exists at the top level writes the global (that is the scope rule); the IR refuses the ambiguous case','Give function locals their own names, or pass the value as a parameter.'],['Unpack from an array','<code>Unpack(Parts, H)</code> with a string array runs in the interpreter; the IR refuses it','Assign the fields from <code>Parts[i]</code> yourself.'],['Push inside each','The IR refuses <code>Push</code> onto an array inside an <code>each</code> loop (auto falls back to legacy); Push onto a function parameter is refused too','Loop over slots with <code>while</code> or <code>for</code> and push there; build arrays in function locals and return them.'],['Web','No HTTP/2; native HTTPS on Windows needs an RSA key; handlers run one request at a time (the I/O around them is concurrent)','Keep handlers short; use a reverse proxy for automatic certificate renewal and HTTP/2.'],['Thread safety','Worker bodies take turns under one lock (released while a worker waits in HttpAccept, client calls or Sleep); the main thread is not held back','Run servers and background jobs as workers; do not change shared heap values from the main thread while workers run.'],['Runtime errors vs Fail','A runtime error (index out of range, <code>for K, V</code> over an array) stops a native program but is reported and skipped in the interpreter; only <code>Fail</code> (and builtins that raise it: FromJson, ParseTime, templates) can be caught with <code>?-&gt;</code>','Validate input before using it; raise <code>Fail</code> yourself for errors a caller should handle.'],['Type-name conversions','<code>i32(X)</code> / <code>X -&gt; i32</code> are reserved but do nothing yet','Use <code>Int()</code>, <code>Float()</code>, <code>Str()</code> or a typed binding.'],['Literals','No hex / binary literals, digit separators or block comments','Write decimal values; comment each line with <code>//</code>.'],['Handbook items not yet implemented','<code>.com</code>/<code>.dom</code> files, ownership arrows, <code>&gt;~</code> folds, <code>~&gt;&gt;</code>, entity-tied match conditions, <code>arr, a, b &gt;- Slice</code>','Use the implemented forms on <a href="#pipes">arrows and flows</a>.']])) ,
    section('validation-status','Recorded validation','<p>The latest full Windows run of the regression harness passed all 214 entries: 204 program cases, the check-only negative cases, and the scripted LSP session. The C backend matched the interpreter on 192 programs and x64 on 196 (x64 also runs the four @ASM cases). The rest are the deliberate error cases and the two each-aliasing programs. The syntax unit tests (38), the web tests (tests/test_web.py: HTTP and HTTPS servers and clients, uploads and WebSockets over real sockets in the interpreter, C and x64; tests/test_web_concurrency.py: keep-alive, slow clients, worker threads), the dev-server tests and the browser-build tests (tests/test_wasm.py: cases compiled to WebAssembly and run in Node) pass; the web cases and socket tests also pass under WSL with gcc and the system OpenSSL. The JSON, time, template and Markdown twins were additionally fuzzed against each other (thousands of random inputs, byte-identical output), and 98 of the IR-covered regression cases printed the same output as WebAssembly. This is a snapshot of the development checkout, not a release certification.</p>'),
    section('roadmap','What remains','<p>Conformance fixes, general C ABI/FFI, runtime safety and safe parallel jobs are compiler foundations. Production math/scene/assets, render graphs, animation, networking and editor tools are larger engine-library milestones. A professional engine requires measured integration demos and lifetime/thread-safety tests—not just more builtin names.</p>')
  ]);

  const WHEN = {
    bindings: choose(['<code>:=</code> for any value your program updates.','<code>=:</code> for tuning values and limits; the checker then rejects any later rebinding.','A type after the name (<code>speed i32 := 5</code>) when width matters: struct fields, node ports, data shared with native code.'], ['You are tempted to annotate every script variable: inference already picks a fitting width, and annotations make later changes harder.','A constant needs to change at runtime: declare it with <code>:=</code> instead of working around <code>=:</code>.','You would write <code>=</code> in a new file: it follows bind-or-reassign rules that are easy to misread; prefer <code>:=</code>.']),
    types: choose(['Let inference choose widths for script values; check the result with <code>check --types</code>.','Convert explicitly with <code>Str()</code>, <code>Int()</code> and <code>Float()</code> when text and numbers meet.','Use literal suffixes (<code>1.5f32</code>, <code>7u8</code>) when a value must have a precise width.'], ['You expect <code>i32(X)</code> or <code>X -&gt; i32</code> to convert: type-name conversions are reserved but not implemented; use <code>Int()</code> / <code>Float()</code>.','Values of different kinds flow into one variable: the checker infers Dyn; keep one kind per variable when you can.','You need f128 precision: native paths widen it to f64.']),
    operators: choose(['Parenthesise whenever you mix arithmetic, comparisons and arrows.','<code>??</code> for a quick fallback when 0, "" and false all mean “missing”.','Inclusive ranges <code>a..b</code> for loops and slices.'], ['Zero or an empty string is a valid value: test with <code>==</code> instead of <code>??</code>.','You need a fractional power: <code>x ^ 0.5</code> truncates the exponent; use <code>√x</code> or a helper.','You rely on short-circuit evaluation to avoid a call: nest <code>if</code>s instead.']),
    strings: choose(['Interpolation <code>"Hp: $Hp"</code> for messages built from variables.','<code>Join</code> for many parts, <code>Split</code> for simple separated text.','<code>S[a..b]</code> when you think in inclusive positions.'], ['A part needs a call or formatting: concatenate <code>"x=" + Str(F(x))</code>.','Text is not ASCII and you index or change case: native paths are byte-oriented.','You process binary data: use <code>Buf</code> or <code>ReadBin</code>, not ordinary strings.']),
    collections: choose(['Arrays for ordered values you append to and loop over.','Maps for lookups by text key, with <code>Get</code> for defaults.','<code>Nums ~&gt; F</code> to build a transformed array in one line.'], ['Keys are fixed field names: a record is clearer and checked.','You need packed, typed elements in a hot loop: <code>Slice(T)</code> over typed memory.','You index maps with numbers: map keys are strings (the checker reports it).','You push onto an array inside <code>each</code> on the IR backends: collect in a <code>while</code> loop instead.']),
    'control-flow': choose(['<code>if</code> blocks when there are several branches or several statements per branch.','<code>for … to</code> for counted loops, <code>for X in A</code> for collections.','<code>switch</code> for many fixed string or integer cases with blocks.'], ['One guarded action: <code>-[c]-&gt; Action</code> is shorter.','A value chosen by cases: a match chain.','Transforming every element: <code>~&gt;</code> iteration.','A one-statement while loop: <code>~[c]~&gt; Body</code>.']),
    functions: choose(['<code>fn</code> for computations that return a value; <code>void</code> for procedures.','Default parameters for optional arguments.','By-ref parameters when a procedure must update the caller’s variable.','<code>global Name</code> when a procedure must change a top-level variable (names a function assigns are otherwise its own locals).'], ['You want named inputs and several named results: a <a href="#nodes">node</a>.','The mutation-through-parameter is surprising to readers: return the new value instead.','You need closures or first-class functions: they are not part of the language; pass data and call named functions.']),
    pipes: choose(['A linear transformation reads naturally left to right: <code>Raw -&gt; Trim -&gt; ToLower</code>.','Several inputs feed one call: <code>a, b &gt;- F</code>.','A value should follow another automatically: <code>-|&gt;</code>.'], ['The chain needs several statements per step: write ordinary statements.','You would need parentheses to explain the precedence: bind intermediate names.','A comma list on the left of <code>-&gt;</code>: that is an error; use <code>&gt;-</code>.']),
    nodes: choose(['A unit of logic has named inputs and several named outputs.','You want logic grouped into categories (<code>Physics.Damage</code>) across a project.','The same unit is called in many styles: <code>N(a, b)</code>, <code>a, b &gt;- N</code>, <code>Xs ~&gt; N</code>.'], ['You need <code>return</code> or an early exit: nodes have none; use <code>fn</code>.','The result is a single value used once: a function is lighter.','A node would share a function’s name: names must be unique.']),
    errors: choose(['A deeper call cannot continue and the caller may know how to recover.','You want a phase to stop cleanly on a broken invariant.'], ['The outcome is normal (not found, empty input): return a value and test it.','You want cleanup on every path: there is no <code>finally</code>; structure the code so cleanup runs after the catch.']),
    records: choose(['A named bundle of fields with defaults: <code>record</code> + <code>Hero{}</code>.','An enum for a closed set of states.'], ['Exact memory layout or pointers: <code>struct</code>.','Open-ended keys: a map.','Many instances iterated every frame: an <code>entity</code>.']),
    modules: choose(['<code>use</code> to bring in a library’s exported functions and its side files.','<code>include</code> to split one program across files that should run as one.'], ['You only need shared values: a .var file next to the scripts.','The library has top-level statements you do not want to run: <code>use</code> skips them, <code>include</code> runs them.']),
    io: choose(['<code>Read</code> / <code>Write</code> for small text files and saves.','<code>Write(path, M)</code> / <code>Read(path, Hero)</code> for a typed record save.','<code>SaveWorld</code> / <code>LoadWorld</code> for entity columns.'], ['The data must survive format changes: these formats have no versioning; add your own version field.','Binary data: <code>ReadBin</code> / <code>WriteBin</code>.','You need atomic writes or locking: write to a temporary file and rename it yourself.']),
    structs: choose(['You need exact field widths, offsets and alignment.','Data is passed to native code or packed into slices.'], ['Ordinary named data: a record is simpler.','You need to pass whole structs by value through many functions: prefer pointers or slices (whole-value passing is restricted).']),
    pointers: choose(['You need a typed view of raw memory or the address of a struct.','Interfacing with Alloc, arenas and BitCast.'], ['Traversing elements: use <code>Slice(T)</code>, which checks bounds.','Ownership matters: use <code>Own</code> or <code>Rc</code> so cleanup is tracked.']),
    slices: choose(['Contiguous typed elements in hot loops: <code>Slice(T)</code>.','Raw byte processing: <code>Buf</code>.'], ['You need a growable list: an array.','The backing memory might be freed while the view lives: keep the owner alive or copy.']),
    ownership: choose(['Arenas for many allocations with one lifetime (per frame, per level).','<code>Own</code> for a single owner; <code>Rc</code> when several holders share.'], ['Values are ordinary strings, arrays, maps or records: they already manage themselves.','Threads share the value: Rc counts are not atomic.']),
    'generics-traits': choose(['Generics when one layout or function should work for several concrete types.','Explicit traits when you need dynamic dispatch through <code>*dyn Trait</code>.'], ['Implicit checking already covers you: untyped parameters work with any value that supports the operations.','You need runtime type inspection: generics are monomorphised at compile time.']),
    concurrency: choose(['A few long tasks: threads.','Many small tasks: a job queue; tasks with dependencies: a job graph.'], ['Tasks share heap values (strings, arrays, maps): worker bodies take turns under one lock (a worker waiting in HttpAccept, an HTTP call or Sleep lets the others run), so CPU work gains little; partition data instead.','You expect speed-ups from many threads touching shared containers: design data ownership first.']),
    ecs: choose(['Many objects share one shape and are processed in loops.','Binder form <code>each P in Player</code> for clear names.','<code>Player ~&gt; Node</code> when each entity runs one node.'], ['You hold slots across frames: store Ids and resolve with <code>FindId</code>.','You remove entities inside <code>each</code>: use a backward <code>while</code> loop with <code>Despawn(E, I)</code>.','A function called from <code>each</code> names the full column (<code>Player_Health</code>): pass the value instead.']),
    'engine-loop': choose(['<code>on Start / FixedTick / Tick / Shutdown</code> blocks under the play host.','Manual <code>Tick()</code> calls in headless tests to step a phase.'], ['The host already runs the phases: do not also call them yourself.','Work that depends on wall-clock timing in tests: use FixedDt-based logic for repeatable results.']),
    physics: choose(['The built-in box world for simple AABB games and deterministic tests.','PhysX / Flow / Blast with <code>--physx</code> when you need joints, shapes or destruction.'], ['You need rotating bodies or friction: the box world has neither.','You rely on stub behaviour: without <code>--physx</code> Px* calls link a zero stub.']),
    web: choose(['Pages are the same for every visitor: generate them with a build program (Markdown + templates) and serve the folder.','You need forms, a JSON API or a local tool: run a server with routes, cookies and JSON.','You fetch data from another http:// service: HttpGet / HttpRequest + FromJson.','While editing: <code>python -m ouroboros serve</code> rebuilds or restarts and reloads the browser.'], ['The site faces the internet and you do not want to manage certificates in your program: keep the Ouro server behind a reverse proxy (or use <code>HttpListenTls</code> with your certificate files).','You need HTTP/2 or automatic certificate renewal: put a reverse proxy in front.','The page itself needs to react to clicks and input: compile that part with <code>--wasm</code> (<a href="#browser">Ouro in the browser</a>) or write a small script.']),
    assembly: choose(['A tiny hot spot or an instruction the language cannot express.','Learning or testing x64 code next to Ouro values.'], ['The code must run on Linux or the C backend: @ASM is x64 only.','The same logic can be written in Ouro: the compiler and register allocator keep it portable and checked.'])
  };
  pages.forEach(p => {
    if (WHEN[p.id]) p.sections.splice(1, 0, section(`${p.id}-when`, 'When to use it', WHEN[p.id]));
    p.sections = p.sections.map(s => s.replace(/\{\{title:([\w-]+)\}\}/g, (_, id) => esc((pages.find(q => q.id === id) || {title: id}).title)));
  });
  return {pages, esc, code, section};
})();
