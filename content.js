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
  const related = items => `<p class="related"><strong>Related:</strong> ${items.map(([id, label]) => `<a href="${id.includes('.') ? id : '#' + id}">${label}</a>`).join(' &middot; ')}</p>`;
  const st = (kind, text) => `<span class="status ${kind}">${text}</span>`;
  const ALL = st('ok','interp · C · x64'), X64 = st('part','x64 only'), INTERP = st('part','interpreter only'), NOTYET = st('no','not implemented');

  add('overview', 'Start here', 'A language that keeps you in control.', 'From expressive scripts to typed memory and native code. Learn Ouroboros one layer at a time.', [
    section('choose-path','Choose your path', `<div class="cards three">${card('whats-new','★','What\'s new','Graph dialect edges, @Math calculus, parallel heap, and ownership through traits.')}${card('quickstart','01','Write your first program','Set up the toolchain, run a script, and understand compilation.')}${card('lexical','Aa','Learn the language','Lexical rules, bindings, values, control flow, functions and modules.')}${card('pipes','|&gt;','Edges & flows','Pipes, maps, folds, guards, match routers, catch and reactive edges.')}${card('decisions','?','Graph dialect cheat-sheet','Canonical spellings; legacy forms still parse during dual-accept.')}${card('structs','&amp; *','Take control of memory','Fixed layouts, pointers, typed slices, arenas, and ownership.')}${card('web','⌁','Websites & HTTP','Static sites, servers, JSON APIs, and WebAssembly pages.')}</div>` + '<p>Looking for one specific construct? The <a href="#feature-index">feature index</a> lists every form A–Z with its status and the page that explains it. Press <kbd>Ctrl K</kbd> to search, <kbd>/</kbd> to filter the page list, and <kbd>[</kbd> / <kbd>]</kbd> to step between pages.</p><p>Building or using the native <strong>self-host subset compiler</strong>? See the dedicated handbook at <a href="selfhost/">selfhost/</a> (frozen dialect, stages 0–2, CLI, limits).</p>'),
    section('small-program','Small syntax. Explicit intent.', code(`// let is a constant, mut a variable; values flow along edges.
let MaxHealth = 100
mut Health = 80
Health += 5

if Health < MaxHealth
    "Health: \${Health}" |> Print
end
mut Scores = [40, 95, 72]
Scores ||> Print`) + '<p>Statements are separated by newlines. Blocks end with <code>end</code>. Ordinary calls (<code>Print(x)</code>) and edges (<code>x |&gt; Print</code>) compile to the same code; the <a href="#decisions">decision guide</a> explains when each reads better. Filter with a predicate on the edge (<code>Scores ||&gt; F when It &gt; 50</code>) or an ordinary <code>if</code> inside a node.</p>'),
    section('mental-model','Mental model: a textual node graph', '<p>An Ouroboros program is a graph written as text. The <code>fn</code>, <code>void</code>, and <code>node</code> blocks are the boxes that compute. A box has ports: the parameters of a function, or the typed <code>in[…]</code> and <code>out[…]</code> lists of a node. Edges such as <code>|&gt;</code> carry a value from one box to the next.</p>' + '<p>The picture is useful because it tells you where to look. To learn what a program does, read a chain left to right: source, edges, boxes, sink. To learn how a box works, read its body, which is ordinary statements (<code>let</code>, <code>mut</code>, <code>if</code>, <code>while</code>, <code>match</code>). Loops stay inside boxes; edges only carry values between them.</p>' + code(`// BOX with typed ports: in[...] are inputs, out[...] are results.
node Damage in[hp: i32, amt: i32] out[hp: i32, dead: bool]
    hp - amt |> Out.hp
    hp - amt <= 0 |> Out.dead
end

// BOX with one input port (the parameter) and one result.
fn Hit(hp)
    return hp - 10
end

// SOURCE: a plain value.
let start = [30, 12, 5]

// EDGES, read left to right: source -> map -> box -> sink.
start ||> Hit |> Print

// GUARD edge: the value continues only while the condition holds.
start | when Len(start) > 2 |> Print

// FAN-IN edge: several values become the arguments of one box.
3, 9 |> Max |> Print

// A node is called like any function; its out ports become fields.
let r = Damage(20, 5)
Print(r.hp, r.dead)

// A fold keeps state without naming every temporary.
let total = start |> Add from 0
total |> Print`, 'Annotated sample') + table(['Written as','Graph idea','Where it is explained'],[['<code>fn F(a)</code> / <code>void F(a)</code> / <code>node N in[a] out[b]</code>','Box with input ports (and result or out ports)','<a href="#functions">Functions &amp; calls</a>, <a href="#nodes">Nodes &amp; .nod files</a>'],['<code>x |&gt; F</code>, <code>a, b |&gt; F</code>','Edge: pipe, fan-in','<a href="#pipes">Edges &amp; flows</a>'],['<code>xs ||&gt; F</code>, <code>Group ||&gt;&gt; F</code>','Edge: map each, parallel each','<a href="#pipes">Edges &amp; flows</a>'],['<code>| when c |&gt; F</code>, <code>x | match … end |&gt; F</code>','Router: guard, first matching arm','<a href="#pipes">Edges &amp; flows</a>'],['<code>f |? Handler</code>, <code>Q |! chain</code>','Catch a Fail, react to a write','<a href="#errors">Errors &amp; Fail</a>'],['<code>outer Name</code>','A wire from a box back to a top-level variable','<a href="#bindings">Bindings &amp; scope</a>']]) + '<p>Both spellings of a call compile to the same code: <code>Print(x)</code> and <code>x |&gt; Print</code>. Use the arrow when the chain reads as a pipeline and the call form when you have one subject and no further steps. The full edge vocabulary, including the ownership edges <code>|=&gt;</code>, <code>|+&gt;</code> and <code>|-&gt;</code>, is in <a href="#pipes">Edges &amp; flows</a> and in the contract document <a href="SYNTAX_GRAPH.md">SYNTAX_GRAPH.md</a>; retired arrows still parse unless <code>OURO_GRAPH_STRICT=1</code> is set.</p>' + related([['pipes','Edges &amp; flows'],['nodes','Nodes &amp; .nod files'],['tour','A practical language tour'],['SYNTAX_GRAPH.md','SYNTAX_GRAPH.md']])),
    section('language-layers','One language, two layers', table(['Layer','Use it for','Core concepts'],[['Values & scripts','Tools, servers, configuration, the web','Gradual types · strings · arrays · maps · records · entities'],['Systems programming','Contiguous data and explicit allocation','Structs · pointers · slices · arenas · Own/Rc · FFI']]) + note('Language-first checkout','This handbook documents the compiler, runtime, and language surface. The former <code>play</code> engine harness and bundled RHI/audio/physics stack were excised in Wave 0; entity columns and <code>on</code> phase syntax remain part of the language. Number-only and heap-safe <code>||&gt;&gt;</code> / <code>|&gt; from</code> already run on all cores while parallel jobs are active. See <a href="#whats-new">What\'s new</a> and <a href="#limitations">compatibility and limitations</a>.')),
    section('handbook-scope','How to use this handbook','<p>The guides explain the programming model; the <a href="#api">builtin reference</a> inventories callable names from compiler tables. Worked examples state what they demonstrate. Backend-specific caveats are included rather than assuming every feature works identically everywhere.</p><p>This is documentation for the current development checkout, not a numbered stable release. Historic feature inventories may contain outdated claims. The current implementation and regression tests take precedence.</p>')
  ], {hero:true});

  add('whats-new','Start here','What\'s new','Graph-in-text dialect (new edges, match/outer, namespaced nodes), plus @Math calculus/complex/tensors, parallel heap, and deeper ownership.',[
    section('wn-graph','Graph dialect', '<p>Ouroboros is a <em>textual node graph</em>: boxes, ports, and a small edge vocabulary. The contract lives in <code>docs/SYNTAX_GRAPH.md</code>. Preferred edges: <code>|&gt;</code> pipe/fan-in, <code>||&gt;</code> map, <code>||&gt;&gt;</code> parallel each, <code>|&gt; F from seed</code> fold, <code>|?</code> catch, <code>|!</code> reactive, <code>| when</code> guard, <code>|=&gt;</code> / <code>|+&gt;</code> / <code>|-&gt;</code> ownership. Inside a box: <code>let</code>/<code>mut</code>/<code>outer</code>, <code>match</code>, <code>name: Type</code>, <code>fn Id[T]</code>, <code>node … in[…] out[…]</code>. Legacy arrows still parse with deprecation; set <code>OURO_GRAPH_STRICT=1</code> to reject them. Stdlib groups: <code>Http.*</code>, <code>Json.*</code>, <code>Dom.*</code>, <code>Thread.*</code> (aliases of the bare builtins).</p>' + code(`mut nums = [1, 2, 3]
nums ||> Double |> Print
let total = nums |> Add from 0
Ready | when Ready |> Fire
First |=> Second`) + '<p>Regression: <code>tests/bug/cases/graph_dialect.ouro</code>. Full before/after tables: the SYNTAX_GRAPH doc.</p>'),
    section('wn-round','Recent foundations', '<p>These features are in the current checkout. Subset surfaces that Chimera emits are gated by <code>compiler/fixtures</code> / self-host cases; broader language samples live under <code>tests/</code>. Each card below jumps to the full guide.</p>' + `<div class="cards three">${card('math-notation','∂ ∇','@Math calculus & tensors','Exact ∂ / ∇ at compile time, complex numbers, vectors and matrices over arrays.')}${card('pipes','≫','Parallel heap work','Atomic refcounts while jobs run so heap-safe ||>> bodies use every core.')}${card('ownership','✓','Ownership checker','Nested containers, trait methods, and FFI callbacks that Free are followed.')}</div>`),
    section('wn-math','@Math: derivatives, complex, tensors', code(`mut x = 3
fn Square(V)
    return V * V
end
mut W = [1.0, 2.0, 3.0]
fn SumSq(A)
    return A[0]^2 + A[1]^2 + A[2]^2
end
@Math
    Print(∂(x^2)/∂x)           // 6
    Print(∂Square(x)/∂x)       // 6
    mut Z = 3 + 2i
    Print(Z, conj(Z), |Z|)     // 3+2i  3-2i  3.6056
    mut U = [1, 2, 3]
    mut V = [4, 5, 6]
    Print(U · V, |U|)          // 32  3.7417
    mut G = ∇SumSq(W)
    Print(G[0], G[1], G[2])    // 2  4  6`) + '<p><code>∂(…)/∂x</code> rewrites into an ordinary expression before typecheck; it follows a user function whose body is one <code>return</code>. <code>∇F(W)</code> builds the array of partials (or maps <code>F\'</code> elementwise when <code>F</code> takes a scalar). Complex values are <code>{Re, Im}</code> maps that Print shows as <code>3+2i</code>; outside <code>@Math</code> read <code>Z.Re</code> / <code>Z.Im</code>. Vectors and matrices are ordinary number arrays: <code>+</code> / scale, <code>·</code> dot, <code>×</code> cross or matrix product, <code>ᵀ</code> transpose, <code>|v|</code> length. Full tables: <a href="#math-notation">Math notation</a>.</p>'),
    section('wn-parallel','Parallel jobs and the heap', code(`entity Body
    mut X = 0.0
    mut V = 1.0
    mut Hits = 0
end
void Move(S)
    X = X + V
    Hits = Hits + 1
end
Body ||>> Move`) + '<p>While parallel workers run, heap retain/release uses atomics and Print takes a short lock, so single-threaded programs keep the plain (faster) path. A <code>||&gt;&gt;</code> node or <code>|&gt; from</code> fold that only does number work, or that builds <em>local</em> heap values without mutating shared containers, can skip the big worker lock. Shared string/array mutation and unguarded globals still serialize or are rejected by the ownership checker. See <a href="#pipes">Edges &amp; flows</a> and <a href="#concurrency">Threads, atomics &amp; jobs</a>.</p>'),
    section('wn-own','Ownership through traits, callbacks, nesting', code(`mut Rows = [[], []]
mut P = Alloc(8)
Rows[0][0] = P
Free(P)
// checker: Rows[0.0] holds a pointer that was freed

trait Holder
    void Eat(Self, P)
end
impl Cup: Holder
    void Eat(Self, P)
        Free(P)
    end
end
// Eat(&C, Q) applies every impl's summary — Q is dead after the call`) + '<p>The checker tracks pointers inside nested arrays and fields, merges summaries for every <code>impl</code> of a trait method, and rejects an FFI callback that <code>Free</code>s / <code>Drop</code>s / moves <code>Own</code>. Details and the full rule table: <a href="#ownership">Arenas, Own &amp; Rc</a>.</p>'),
    section('wn-cases','Where to try them', table(['Feature','Regression case'],[['<code>∂</code> / <code>∇</code>','<code>tests/bug/cases/math_diff.ouro</code>'],['Complex <code>i</code> / <code>|z|</code>','<code>tests/bug/cases/math_complex.ouro</code>'],['Vectors / matrices','<code>tests/bug/cases/math_tensor.ouro</code>'],['Textbook @Math','<code>tests/bug/cases/math_notation.ouro</code>'],['Parallel number work','<code>tests/bug/cases/parallel_numeric.ouro</code>'],['Nested + trait ownership','<code>tests/check/ownership_nested.ouro</code>'],['Graph dialect edges','<code>tests/bug/cases/graph_dialect.ouro</code>']]) + '<p>Subset fixtures Chimera can emit live under <code>compiler/fixtures/</code>; see the <a href="selfhost/">self-host handbook</a>. Broader cases under <code>tests/</code> are not all in the Chimera freeze yet.</p>')
  ], {nav: 'What\'s new'});

  add('quickstart','Start here','Installation & first program','Go from a local checkout to your first native executable.',[
    section('prerequisites','Prerequisites', '<p>Run commands from the repository root. You need a C toolchain and a <strong>Chimera</strong> binary (<code>build/chimera</code> / <code>build/chimera.exe</code>). Obtain it from CI seed artifacts or the <a href="selfhost/">self-host handbook</a> bootstrap, then <code>make tools-bootstrap</code> for <code>ouro-link</code> / <code>ouro-run</code>.</p>' + table(['Platform','C toolchain','Notes'],[['Windows','MSVC Build Tools, or clang/gcc','Chimera emits C; <code>ouro-link</code> drives cl/link'],['Linux / WSL','gcc or clang','Same emit → link path'],['Other platforms','Not validated','Use the C toolchain Chimera already discovers']]) + note('Compiler name','Day-to-day compile/run is Chimera + <code>ouro-link</code> / <code>ouro-run</code>. The frozen dialect is in the <a href="selfhost/">self-host handbook</a>.')),
    section('hello','Hello, Ouroboros', '<p>Create <code>main.ouro</code> in your project:</p>' + code(`Print("Hello, Ouroboros!")
let Name = "builder"
Print("Welcome, \${Name}")`, 'main.ouro') + code(`# Windows
tools\\ouro_run.bat main.ouro

# or emit + link
build\\chimera.exe main.ouro -o build\\main.c
tools\\ouro_link.bat build\\main.c -o build\\main.exe --out-dir build
build\\main.exe`, 'Terminal','shell') + '<p>On Unix use <code>tools/ouro_run.sh</code> / <code>tools/ouro_link.sh</code> and <code>build/chimera</code>. Chimera writes C; <code>ouro-link</code> compiles and links the portable runtime. Prefer programs in the <a href="selfhost/">Chimera subset</a> until the dialect grows.</p>'),
    section('qs-layout','Project layout', '<p>A single <code>main.ouro</code> is a complete program. As it grows, three side-file kinds let several scripts share data without importing it by hand: <code>.var</code> (shared values), <code>.ent</code> (entity archetypes) and <code>.nod</code> (node libraries). A <code>ouroboros.project</code> manifest, when present, lists exactly which side files to load.</p>' + code(`arena/
  ouroboros.project     optional manifest (see below)
  main.ouro             entry point: tools/ouro_run.bat arena/main.ouro
  world.var             shared values for every .ouro in this folder
  entities/
    mob.ent             entity archetypes
  nodes/
    Combat.nod          node library, category "Combat"`, 'Layout', 'text') + code(`// world.var
mut Damage = 5
let MaxHealth = 100`, 'world.var') + code(`// entities/mob.ent
entity Mob
    mut Hp = 20
end`, 'mob.ent') + code(`// main.ouro: Damage and MaxHealth come from world.var, Mob from mob.ent
mut Health = MaxHealth
Health -= Damage
Spawn(Mob)
each m in Mob
    Print("\${m.Hp} / \${Health}")
end`, 'main.ouro') + code(`# ouroboros.project
entities:
  - entities/mob.ent
components:
  - components/combat.com
nodes:
  - nodes/Combat.nod
domains:
  - domains/vec.dom`, 'ouroboros.project', 'text') + '<p>Without a manifest, a <code>.var</code> in the script folder is loaded automatically, and <code>.ent</code> / <code>.nod</code> files are found by walking the script folder tree and up to three ancestor folders. With a manifest, discovery uses only the listed paths plus the same-folder <code>*.var</code> files. Point Chimera / <code>ouro-run</code> at the entry <code>.ouro</code> file (for example <code>arena/main.ouro</code>).</p>' + note('Do not import a .var you already have','A same-folder <code>.var</code> is already loaded. Adding <code>use &quot;world.var&quot;</code> on top of that reports "public variable is already declared". Use <code>use</code> for a <code>.var</code> that lives in another folder.',true) + related([['modules','Modules &amp; project structure'],['project-files','Project files']])),
    section('qs-commands','Compile and run', '<p>Chimera emits C; <code>ouro-run</code> emits, links, and executes in one step. Use emit+link when you want the intermediate <code>.c</code>.</p>' + table(['Command','What it does','Use it when'],[['<code>tools/ouro_run.bat main.ouro</code>','Emit C, link with <code>ouro-link</code>, run the executable.','Day-to-day scripts and fixtures.'],['<code>build/chimera.exe main.ouro -o out.c</code>','Emit C only (optional <code>--dump-ast</code>).','Inspecting output or feeding a custom link.'],['<code>tools/ouro_link.bat out.c -o out.exe --out-dir build</code>','Compile/link the runtime + program.','After a separate emit.']]) + code(`tools\\ouro_run.bat main.ouro
build\\chimera.exe main.ouro -o build\\main.c --dump-ast
make ouro-run PROG=compiler/fixtures/hello.ouro`, 'Terminal', 'shell') + '<p>See the <a href="#cli">command-line reference</a> and <a href="#backends">compiler pipeline</a>. Features outside the Chimera freeze are listed in the <a href="selfhost/">self-host handbook</a>.</p>' + related([['cli','Command-line reference'],['backends','Compiler &amp; backends']])),
    section('toolchain','Toolchain overrides', table(['Variable','Purpose'],[['<code>OURO_CC</code>','C compiler for <code>ouro-link</code> (otherwise discovered).'],['<code>OURO_LINK</code>','MSVC <code>link.exe</code> next to cl, when needed.'],['<code>OURO_LIBPATH</code>','Windows kit lib path for freestanding link.'],['<code>OURO_KIND</code>','Force <code>msvc</code> / hosted kind when set.']])),
    section('qs-strict','Strict graph mode: OURO_GRAPH_STRICT', '<p>The compiler still accepts retired spellings (the old arrows, bracket-abs, <code>include</code>, <code>global</code>) and warns about them. Set <code>OURO_GRAPH_STRICT=1</code> to turn those warnings into errors, so that new code stays in the graph dialect and migrations are complete. Turn it on for new projects and in CI; leave it off while you are still porting old scripts.</p>' + code(`# Prefer graph-dialect spellings in new code (|>, ||>, use, mut, …).
# See SYNTAX_GRAPH.md for the full before/after catalogue.`, 'Terminal', 'shell') + table(['Retired form','Graph dialect'],[['<code>x -&gt; Print</code>, <code>xs ~&gt; F</code>','<code>x |&gt; Print</code>, <code>xs ||&gt; F</code>'],['<code>Parse(s) ?-&gt; Log</code>','<code>Parse(s) |? Log</code>'],['<code>global Hits</code>','<code>outer Hits</code>'],['<code>[x]</code> as absolute value','<code>abs(x)</code>'],['<code>speed i32 := 5</code>','<code>mut speed: i32 = 5</code>'],['<code>include &quot;util.ouro&quot;</code>','<code>use &quot;util.ouro&quot;</code>']]) + '<p>The full before/after catalogue is in <a href="SYNTAX_GRAPH.md">SYNTAX_GRAPH.md</a>; <a href="#pipes">Edges &amp; flows</a> lists the retired arrows next to their replacements.</p>' + related([['SYNTAX_GRAPH.md','SYNTAX_GRAPH.md'],['pipes','Edges &amp; flows'],['whats-new','What is new']])),
    section('qs-errors','Common first errors', '<p>Most first-day errors are a missing declaration, a wrong call shape or a spelling the checker recognises from an older dialect. The checker reports a line and column and, for near misses, suggests the name you probably meant.</p>' + table(['Message (abridged)','Usual cause','Fix'],[['<code>unknown function &#x27;Id&#x27;</code>','Calling a name that is not defined, or a generic function without its type argument.','Check the spelling; call a generic as <code>Id(i32)(7)</code>. Builtin names are case-insensitive but user names are not.'],['<code>unknown variable &#x27;Mob_Id&#x27;</code>','Using an entity column that the entity does not declare.','Declare the field in the entity (<code>mut Id = 0</code>); columns exist only for declared fields, named <code>Entity_Field</code>.'],['<code>expected &#x27;|&gt;&#x27; after &#x27;| match … end&#x27;</code>','A match router with nothing after <code>end</code>.','Finish the chain: <code>end |&gt; Print</code>, or use the statement form <code>match x … end</code>.'],['<code>Fail expects 1 arg (a str message), got 2</code>','<code>x |&gt; Fail(&quot;msg&quot;)</code> puts <code>x</code> in front of the message.','Send the message through the edge: <code>&quot;msg&quot; | when c |&gt; Fail</code>.'],['<code>&#x27;Hits&#x27; is assigned in &#x27;Hit&#x27;, so it is a local there</code>','A function changes a top-level variable without declaring it.','Write <code>outer Hits</code> as the first line of the function.'],['<code>&#x27;Limit&#x27; is a constant</code>','Rebinding or updating a <code>let</code> name.','Declare it with <code>mut</code> if it must change.'],['<code>expected a value or expression</code>','A chain or list written in a spelling the parser does not accept at that position, such as a leading <code>| when</code> with no subject.','Put the value on the left of the edge, and keep each chain on one line.'],['text/number operator conflict, hint <code>use Str() to convert</code>','<code>1 + &quot;x&quot;</code>; text and numbers never convert implicitly.','Convert explicitly, or interpolate: <code>&quot;n = ${n}&quot;</code>.']]) + code(`mut hits = 0
void Hit()
    hits += 1          // error: 'hits' is assigned in 'Hit', so it is a local there
end

void HitFixed()
    outer hits
    hits += 1          // ok: changes the top-level variable
end`, 'A typical first error') + related([['errors','Errors &amp; Fail'],['bindings','Bindings &amp; scope'],['types','Values &amp; type checking']]))
  ]);

  add('tour','Start here','A practical language tour','Build familiarity with values, loops, records, and explicit data.',[
    section('tour-values','Values and intent', code(`let Label = "Ouroboros"
mut Score = 0
Score += 10
let Enabled = true
mut Samples = [10, 20, 30]
Print(Label, Score)
Samples[0] |> Print
"\${Label} scored \${Score}" |> Print`) + '<p><code>let</code> introduces a constant; <code>mut</code> a variable. Unsuffixed values infer their kind. Arrays use zero-based indices. <code>${Name}</code> inside a string inserts the value (a bare <code>$Name</code> also works).</p>'),
    section('tour-functions','Functions, iteration and flows', code(`fn Double(N)
    return N * 2
end

mut Numbers = [1, 2, 3]
for N in Numbers
    Print(Double(N))
end
mut Doubled = Numbers ||> Double
Doubled |> Print
3, 9 |> Max |> Print`) + '<p><code>fn</code> returns a value. <code>void</code> declares a procedure. Function parameters are inferred from call sites unless systems annotations are supplied. <code>||&gt;</code> sends each element through a function and collects the results; <code>|&gt;</code> feeds several values into one call. See <a href="#pipes">edges and flows</a>.</p>'),
    section('tour-edges','Edges: wiring values together', '<p>Edges are how values travel between functions. A short chain replaces temporary variables and nested calls, and the direction of reading matches the direction of the data. Reach for <code>||&gt;</code> where you would otherwise write a loop that builds a new array, and for <code>|&gt; F from seed</code> where you would otherwise keep a running total.</p>' + code(`fn Double(n)
    return n * 2
end
fn Add(acc, n)
    return acc + n
end

let nums = [3, 1, 4]
// pipe: the left value is the first argument
nums |> Len |> Print                  // 3
// fan-in: every input is an argument, in order
3, 9 |> Max |> Print                  // 9
// map: each element through Double, results collected
let doubled = nums ||> Double
doubled |> Print                      // [6, 2, 8]
// fold: Add(acc, item) for each item, starting from 0
let total = nums |> Add from 0
Print("total \${total}")              // total 8
// guard: continue only when the condition holds
total | when total > 5 |> Print       // 8
// store: a bare name at the end writes an existing variable
mut best = 0
total |> best
Print(best)                           // 8`, 'Edges') + '<p>Do not write <code>a, b |&gt; F</code> with parentheses after <code>F</code>: fan-in already passes every value as an argument. A store at the end of a chain never declares a variable, so declare it first with <code>mut</code>.</p>' + related([['pipes','Edges &amp; flows'],['decisions','Which form should I use?'],['collections','Arrays &amp; maps']])),
    section('tour-match','Match: choosing by value', '<p><code>match</code> is the one selection form. As a router it turns a subject into a value that continues down the chain; as a statement it runs the branch whose head fits. Prefer it to a long <code>if</code> / <code>elseif</code> ladder when every branch tests the same subject. Arms are tried in order; a literal head compares with <code>==</code>, any other head is a condition on the subject, written with <code>It</code>; <code>_</code> is the else arm.</p>' + code(`void Show(n)
    n | match
        0 -> "zero"
        It < 0 -> "negative"
        _ -> "positive"
    end |> Print
end

fn Go()
    Print("moving")
end
fn Halt()
    Print("halting")
end
fn Idle()
    Print("unknown command")
end

let xs = [0, -3, 9]
xs ||> Show                           // zero, negative, positive

let cmd = "stop"
match cmd
    "go" -> Go()
    "stop" -> Halt()
    _ -> Idle()
end

mut code = 0
cmd | match
    "start" -> 1
    "stop" -> 2
    _ -> 0
end |> code
Print(code)                           // 2`, 'Match') + '<p>The router form must end with <code>|&gt; Dest</code> (a function, a variable or <code>Print</code>); a bare <code>end</code> is an error. Use the statement form when each arm performs an action, and the router form when each arm produces a value.</p>' + related([['pipes','Edges &amp; flows'],['control-flow','Control flow']])),
    section('tour-records','Named data', code(`record Hero
    mut Name = "Ada"
    mut Health = 100
end

mut Player = Hero{}
Player.Health = 90
Print(Player.Name)
Print(Player.Health)`) + '<p>A <code>record</code> is a template with defaults. <code>Hero{}</code> creates a heap record whose fields you read and write with <code>.</code>. A <code>struct</code>, in contrast, provides a fixed C-like memory layout for systems work.</p>'),
    section('tour-entities','Entities: many things of one shape', '<p>When a program has many similar objects (mobs, bullets, tiles), store them as an <code>entity</code>. Each field becomes a column, and <code>Spawn</code> appends a row of defaults. An entity loop uses an explicit binder, <code>each m in Mob</code>, so every field read is written <code>m.Hp</code> and nothing is ambient. Use a plain record when there is only one object.</p>' + code(`entity Mob
    mut Hp = 10
    mut Name = "slime"
end

Spawn(Mob)
Spawn(Mob)

each m in Mob
    m.Hp -= 3
    Print("\${m.Name}: \${m.Hp}")      // slime: 7  (twice)
end

// A node called per entity sees the current row through bare field names.
void Heal(s)
    Hp += 1
end
Mob ||> Heal

each m in Mob where m.Hp > 7
    Print("healthy #\${m.Id}")        // healthy #0, healthy #1
end
Print(Len(Mob_Hp))                    // 2`, 'Entities') + '<p>The columns are ordinary arrays named <code>Entity_Field</code> (<code>Mob_Hp</code>), so <code>Len(Mob_Hp)</code> is the entity count. Without an <code>Id</code> column, <code>m.Id</code> is the row index. See <a href="#project-files">Project files</a> for stable ids, removal and components.</p>' + related([['project-files','Project files'],['records','Records &amp; enums'],['pipes','Edges &amp; flows']])),
    section('tour-loops','Loops and repetition', code(`mut I = 0
while I < 3
    Print("step \${I}")
    I += 1
end

for N in [10, 20, 30]
    N |> Print
end`) + '<p>Ordinary <code>while</code> and <code>for</code> loops live inside functions and top-level scripts. Use <code>each</code> when you iterate entity rows (see above) and <code>||&gt;</code> when a node should run once per element. Phase blocks (<code>on Start</code> / <code>on Tick</code>) still parse but there is no bundled frame host in this checkout.</p>'),
    section('tour-fail','Failing and catching with |?', '<p>A function that cannot do its job calls <code>Fail(&quot;message&quot;)</code>. The failure unwinds to the nearest <code>|?</code> on the way out, which receives the message and supplies a replacement value. Use it for conditions the caller may want to handle, and plain return values for ordinary outcomes such as "not found".</p>' + code(`fn Parse(s)
    "empty input" | when Len(s) == 0 |> Fail
    return Int(s)
end
fn Log(m)
    Print("caught: \${m}")
    return -1
end

let a = "21" |> Parse |? Log          // 21
let b = "" |> Parse |? Log            // prints "caught: empty input", b is -1
Print(a, b)                           // 21 -1`, 'Fail and |?') + '<p>The guard <code>&quot;empty input&quot; | when Len(s) == 0 |&gt; Fail</code> sends the message into <code>Fail</code> only when the condition holds; otherwise the chain stops and the next statement runs. <a href="#errors">Errors &amp; Fail</a> covers where to place <code>|?</code> and what happens with no handler.</p>' + related([['errors','Errors &amp; Fail'],['pipes','Edges &amp; flows']])),
    section('tour-program','Putting it together: a small program', '<p>This program uses every idea from the tour: a function that fails on bad input, a handler, a map and a fold over the results, an entity, a guarded loop and a match router. Save it as <code>arena.ouro</code> and run <code>tools/ouro_run.bat arena.ouro</code> (or <code>tools/ouro_run.sh</code>).</p>' + code(`entity Mob
    mut Hp = 20
    mut Name = "slime"
end

fn Parse(s)
    "empty command" | when Len(s) == 0 |> Fail
    return Int(s)
end
fn Warn(m)
    Print("skipped: \${m}")
    return 0
end
fn Safe(s)
    return s |> Parse |? Warn
end
fn Add(acc, n)
    return acc + n
end

mut dmg = 0
void Hit(s)
    Hp -= dmg
end
void Report(s)
    Hp | match
        It <= 0 -> "down"
        It < 10 -> "hurt"
        _ -> "fresh"
    end |> Print
end

Spawn(Mob)
Spawn(Mob)

let commands = ["9", "", "6"]
let amounts = commands ||> Safe              // "" is caught, becomes 0
let total = amounts |> Add from 0
Print("total damage \${total}")

dmg = total
Mob ||> Hit
Mob ||> Report

each m in Mob where m.Hp < 10
    Print("\${m.Name} #\${m.Id} has \${m.Hp} hp")
end`, 'arena.ouro') + code(`skipped: empty command
total damage 15
hurt
hurt
slime #0 has 5 hp
slime #1 has 5 hp`, 'Output', 'text') + '<p>Read it as a graph: <code>commands</code> flows through the box <code>Safe</code> (which contains a catch), is folded by <code>Add</code>, and the result is stored in <code>dmg</code>. <code>Hit</code> and <code>Report</code> are called once per entity row. Change the second command to <code>&quot;20&quot;</code> and the <code>Report</code> arm changes to <code>down</code>.</p>' + related([['pipes','Edges &amp; flows'],['errors','Errors &amp; Fail'],['project-files','Project files'],['recipes','Worked examples']]))
  ]);

  add('decisions','Start here','Which form should I use?','Prefer the graph dialect in docs/SYNTAX_GRAPH.md. This page is a short cheat-sheet while legacy spellings still parse.',[
    section('d-graph','Graph dialect first', '<p>Everyday wiring uses <code>|&gt;</code>, <code>||&gt;</code>, <code>||&gt;&gt;</code>, <code>|?</code>, <code>|!</code>, <code>| when</code>, <code>|=&gt;</code>. Inside boxes: <code>let</code>/<code>mut</code>/<code>outer</code>, <code>match</code>, <code>name: Type</code>. Full tables and before/after samples: <a href="SYNTAX_GRAPH.md">SYNTAX_GRAPH.md</a>. Set <code>OURO_GRAPH_STRICT=1</code> to reject retired arrows.</p>'),
    section('d-bindings','Bindings and values', pick([
      ['A value that changes', C('mut Speed = 5'), 'Legacy <code>mut Speed = 5</code> still parses.'],
      ['A value that must never change', C('let Limit = 100'), 'Legacy <code>let Limit = 100</code> still parses.'],
      ['A precise width (layout, ports, interop)', C('mut speed: i32 = 5'), 'Script values: leave numbers untyped and let inference pick the width.'],
      ['Zeroed systems storage', C('mut pos: f32 = 0.0') + ' / ' + C('mut V: Vec3'), 'You have a real initial value: bind it directly.'],
      ['Add or subtract one', C('count++') + ' / ' + C('count--'), 'The target is a field or element: write <code>X.F += 1</code>.'],
      ['Arithmetic on the same name', C('Hp += 5'), 'The index has side effects (<code>A[Next()] += 1</code> is rejected): bind the index first.'],
      ['Change a top-level variable from a function', C('outer Score') + ' at the start of the body', 'Legacy <code>outer Score</code> still parses.'],
      ['Scratch variables in a function', 'just assign them (they are locals)', 'The value must outlive the call: return it, or declare it <code>outer</code>.']
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
      ['Branch with several outcomes and blocks', C('if … elseif … else … end'), 'One action guarded by a condition: <code>| when c |&gt; Action</code> is shorter.'],
      ['Run one thing only when a condition holds', C('| match Ready]|> Fire'), 'You need an else branch: use <code>if</code> or a match chain.'],
      ['Pick a value by cases', C('x | match\n    1 -> "one"\n    _ -> "other"\nend |> Dest'), 'Each case runs several statements: <code>switch</code>.'],
      ['Select among strings / ints with blocks', C('switch X case "a", "b" … end'), 'You only need a value: a match chain.'],
      ['Repeat while a condition holds', C('while c … end'), 'Prefer <code>while</code> inside a box (supports <code>break</code> / labels). Do not use retired loop-as-edge glyphs.'],
      ['Count between two numbers', C('for mut I = 1 to 10 by 2'), 'You want every element of a collection: <code>for X in Arr</code>.'],
      ['Transform every element into a new array', C('mut D = Nums ||> Double'), 'You need the index or early exit: <code>for</code> with <code>break</code>.'],
      ['Keep only some elements', C('Nums ||> F'), 'The filter needs several statements: a <code>for</code> loop with <code>if</code>.'],
      ['Leave a loop early', C('break') + ' / ' + C('break Outer'), 'Inside <code>||&gt;</code> iteration: there is no break, use a loop.']
    ])),
    section('d-calls','Calls and code organisation', pick([
      ['A reusable computation that returns a value', C('fn F(X) … return … end'), 'You want named inputs and several named outputs: a node.'],
      ['A procedure with side effects only', C('void Log(M) … end'), 'It should return something: <code>fn</code>.'],
      ['Several named results from one call', C('node N in[…] out[A, B]'), 'One result: a function is enough.'],
      ['Call with one subject', C('F(x)') + ' or ' + C('x |> F'), 'Pick the form that reads left to right; a chain of 3+ steps reads best as arrows.'],
      ['Call with several inputs', C('a, b |> F') + ' or ' + C('F(a, b)'), 'Never write <code>a, b |&gt; F</code>: it is an error.'],
      ['Method-style reading', C('Words.Len()'), 'It hides which argument is the receiver for multi-argument calls: write the call.'],
      ['Share helpers between programs', C('use "lib/"') + ' + ' + C('export'), 'You want the other file’s statements to run here: <code>include</code>.']
    ])),
    section('d-errors','Errors and missing values', pick([
      ['A failure the caller may handle', C('Fail("msg")') + ' + ' + C('|? Handler'), 'The outcome is expected (not found, empty): return a value such as -1 and test it.'],
      ['A default for a missing map key', C('Get(M, "k", 0)'), 'You need to know whether the key exists: <code>Has(M, "k")</code>.'],
      ['A fallback for a falsy value', C('X ?? 10'), 'Zero or "" are valid values for you: <code>??</code> replaces them too, so test explicitly.'],
      ['Stop a phase on a broken invariant', 'uncaught ' + C('Fail'), 'The program should keep the phase running: catch it with <code>|?</code>.']
    ])),
    section('d-change','Reacting to change', pick([
      ['Derived value that follows a global', C('Q |! Double |> R'), 'The source changes by element or field writes (they do not trigger), or the dependency is inside a function.'],
      ['Repeat while a condition holds', C('while c … end'), 'You know how many steps: <code>for … to</code>.'],
      ['Visit every element', C('for X in Arr') + ' / ' + C('Xs ||> F'), 'You need indices or mutation per slot: <code>while</code> with a counter.'],
      ['One value chosen from cases', C('x | match … end |> F'), 'Each arm runs statements: <code>switch</code> or <code>if</code>.']
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
      ['Call one node per entity', C('Player ||> Update'), 'The body is more than one call: <code>each</code>.'],
      ['Only some entities', C('each P in Player where P.Hp > 0'), 'Or map with a guard: <code>Player ||&gt; Node when Hp &gt; 0</code>.'],
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
      ['Day-to-day native build', C('tools/ouro_run.bat prog.ouro'), 'Inspect C: Chimera <code>-o</code> then <code>ouro-link</code>.'],
      ['Emit C only', C('build/chimera … -o out.c'), 'Custom link or reading generated code.'],
      ['Inline Win64 assembly', C('@ASM'), 'Not in the Chimera freeze yet; see self-host limits.']
    ], ['If you need…','Use','Instead, when…']))
  ]);

  add('lexical','Language guide','Lexical structure','How source text becomes tokens: files, lines, comments, names, literals and the characters that change meaning with spacing.',[
    section('lx-files','Files, lines and blocks', '<p>Source files are UTF-8 text. One statement per line; a newline ends the statement. There is no semicolon. Blocks (<code>if</code>, <code>while</code>, <code>for</code>, <code>fn</code>, <code>void</code>, <code>record</code>, <code>struct</code>, <code>entity</code>, <code>enum</code>, <code>trait</code>, <code>impl</code>, <code>switch</code>, <code>each</code>, <code>with</code>) are closed by <code>end</code>. Indentation inside them is for readers only.</p><p>Two blocks also end by indentation: an <code>on Phase</code> block and a <code>node</code> body end at <code>end</code> or at the first line that is no further right than the keyword that opened them. Arrow blocks (<code>| when c |&gt;</code>, <code>| match … end |&gt;</code>, and <code>while c … end</code> followed by a newline) end at <code>end</code>.</p>' + choose(['Always: one statement per line keeps diagnostics pointing at the right line.'], ['You want to split a long arrow chain: keep it on one line or bind intermediate results to names; there is no line-continuation character.'])),
    section('lx-comments','Comments', code(`// A line comment runs to the end of the line.
mut Speed = 5   // trailing comments are fine
/* A block comment can span lines.
   /* Block comments nest, */ so commenting out code that has one is safe. */
mut Damage = Base /* before armor */ * 2`) + '<p><code>//</code> runs to the end of the line. <code>/* … */</code> can sit inside a line or span several, and nests: every <code>/*</code> needs its own <code>*/</code>, and an unclosed one is an error that points at where it opened. A block comment that spans lines also ends the statement it started on, just as a newline would. Comment markers inside strings are ordinary text. Inside <code>@ASM { … }</code> use the assembler’s <code>;</code> comments.</p>'),
    section('lx-names','Names and keywords', '<p>Names start with a letter or underscore and continue with letters, digits or underscores. Names are case-sensitive: <code>Health</code> and <code>health</code> are different variables. Keywords are matched case-insensitively, so <code>If</code>, <code>END</code>, <code>In</code> and <code>On</code> are keywords too; node ports accept <code>In</code> specially. Builtin names are case-insensitive (<code>print</code> and <code>Print</code> are the same builtin), so do not reuse them as variable names.</p>' + note('Naming convention','Use PascalCase for variables, functions, nodes, entities and types (<code>PlayerHealth</code>, <code>Damage</code>). Entity columns are generated as <code>Entity_Field</code>, so avoid underscores in your own names where they could collide.')),
    section('lx-literals','Literals', table(['Kind','Examples','Notes'],[['Integer',C('42')+' '+C('-7')+' '+C('1_000_000'),'Unsuffixed values pick the smallest fitting signed width. <code>_</code> separates digits and is ignored; it must sit between two digits.'],['Hex / binary / octal',C('0xFF')+' '+C('0b1010_1010')+' '+C('0o755'),'Prefixes 0x, 0b, 0o (either case); separators and integer suffixes work (<code>0xFFu8</code>). A digit outside the base is an error.'],['Integer suffix',C('42i32')+' '+C('7u8')+' '+C('1i64'),'i8 i16 i32 i64 u8 u16 u32 u64.'],['Float',C('1.5')+' '+C('2.5e-3')+' '+C('1e6')+' '+C('3.141_592'),'A decimal point or exponent makes a float. Floats are decimal only.'],['Float suffix',C('1.5f')+' '+C('1.5f32')+' '+C('0.1f64')+' '+C('2.0f16'),'<code>f</code> is f32; f128 parses but is widened on native paths.'],['Boolean',C('true')+' '+C('false'),'Printed as true / false; stored as 0/1 in records.'],['String',C('"text"'),'Escapes: \\n \\r \\t \\" \\\' \\\\ \\xHH, and \\u00E9 or \\u{1F600} for any character. Interpolation with $Name or ${expression}; $$ is a dollar sign. One line only.'],['Multi-line string',C('"""…"""'),'Spans lines; the closing quotes’ indentation is stripped from every line. Same escapes and interpolation.'],['Character',C("'A'")+' '+C("'\\n'"),'Escapes: \\n \\r \\t \\\' \\\\ \\0.'],['Array',C('[1, 2]')+' '+C('[7]')+' '+C('[]'),'<code>[x]</code> is a one-element array (the trailing comma is optional). Absolute value is <code>abs(x)</code>; the old bracket-abs spelling is deprecated and rejected under <code>OURO_GRAPH_STRICT=1</code>.'],['Map',C('{ gold: 10, "hp": 3 }')+' '+C('{}'),'Bare keys become strings.'],['Range',C('1..5')+' '+C('[1 to 5]'),'Both inclusive.']])),
    section('lx-operators','Operator characters', table(['Characters','Meaning'],[[C('+ - * / % ^'),'Arithmetic; <code>^</code> is power in math, XOR in conditions.'],[C('× ÷ √ ⌊x⌋ ⌈x⌉'),'Unicode spellings: multiply, divide, root, floor, ceiling.'],[C('== != < > <= >='),'Comparison.'],[C('&& || ! and or & | ~'),'Logic in conditions.'],[C('let mut = += -= *= /= %= ++ --'),'Binding and update.'],[C('|> ||> ||>> |? |! | when |=> |+> |->'),'Arrows (see <a href="#pipes">edges and flows</a>).'],[C('.. ?? @ & *'),'Range, coalesce, entity lookup / target, address-of, dereference.']]) + note('Prefer clear spacing','write <code>a &gt; -1</code> for a comparison (no spacing-sensitive <code>|-&gt;</code> digraph). <code>| when …</code> opens an arrow condition; write <code>- abs(x)</code> for minus absolute value. A minus directly before a digit can lex as a negative literal, so put spaces around binary minus. <code>++</code> and <code>--</code> are steps only after a name.',true))
  ]);

  add('bindings','Language guide','Bindings & scope','Understand mutability, assignment, naming, and where values live.',[
    section('declarations','Declarations and assignment', table(['Form','Meaning'],[['<code>mut X = value</code>','Mutable binding (the handbook spelling).'],['<code>let X = value</code>','Constant binding.'],['<code>mut speed: i32 = 5</code>','Typed binding: <code>name: Type</code> after the name, then the value.'],['<code>mut pos: f32</code>','Typed declaration with no value: zero-filled.'],['<code>let Limit: i64 = 100</code>','Typed constant: the width is fixed and the name cannot be rebound.'],['<code>outer Name</code>','First line of a function body: assignments to <code>Name</code> change the top-level variable instead of creating a local.'],['<code>X = value</code>','Uses the existing bind-or-reassign scope rules.'],['<code>mut V: Vec3</code>','Zero-initialized systems-typed declaration.'],['<code>count++</code> / <code>count--</code>','Same as <code>count += 1</code> / <code>count -= 1</code> (names only).']]) + code(`mut Speed = 10
mut Speed = -5
Speed += 2
Speed++
let Limit = 100
mut Rate: f64 = 1.5
mut Ticks: u32`) + '<p>Untyped numbers keep their inferred width. Types after the name (<code>name: Type</code>) work for bindings, parameters (<code>fn F(a: i32)</code>), struct fields (<code>X: f32</code>) and node ports (<code>in[hp: i32]</code>). Where a type name appears decides what it means: after a name it is a type annotation, in an expression it is a conversion.</p>' + note('Assignment is not a new scope model','<code>=</code> is an additive syntax spelling, not an assignment-only operation. Do not assume C-style declarations or Rust-style shadowing. Mutable bindings can change value kind in the gradual path.')),
    section('constants','Constants', code(`let Limit = 100
mut Limit = 200      // error: 'Limit' is a constant (let at 1:1)
void Raise()
    outer Limit
    Limit += 1    // error too: the outer is the constant
end`) + '<p>A top-level <code>let</code> binding is fixed. The checker reports any later binding of that name, including <code>+=</code>, <code>++</code> and writes from functions that declare it <code>outer</code>, so the interpreter and the native backends agree. Constants in a <code>.var</code> file are shared like any other public value. A parameter that happens to share the constant’s name is a separate variable inside its function.</p>'),
    section('compound','Compound assignments', '<p><code>+= -= *= /= %=</code> normalize to read → arithmetic → write. Names, fields, array indices and slice fields are supported. Compound declarations, loop binders and parameter defaults are rejected.</p>' + code(`mut Values = [10, 20]
Values[0] += 5
// Bind effectful index expressions first.
let Index = 1
Values[Index] *= 2`) + note('No hidden double call','<code>Values[NextIndex()] += 1</code> is rejected. Bind the index or pointer-producing call first. Legacy <code>mut X = + 2</code> is compound sugar, but <code>X = + 2</code> is ordinary unary-positive assignment.',true)),
    section('function-scope','Function scope and outer', code(`mut Hits = 0
mut Name = "top"
mut Scores = [1, 2]
void Hit()
    outer Hits
    Hits += 1         // changes the top-level Hits
    Scores[0] = 9    // changing an element needs no outer
    mut Name = "local"   // a new local; the top-level Name is untouched
end
Hit()
Print(Hits, Name)`) + '<p>Inside a function, node or procedure, every name the body assigns (<code>=</code>, <code>+=</code>, <code>++</code>, <code>|&gt; Name</code>, <code>for</code> / <code>with</code> variables) is a local of that function, for the whole body. To change a top-level variable, write <code>outer Name</code> (or <code>outer A, B</code>) at the start of the body. Reading a top-level variable needs no declaration, and changing an element or a field (<code>Scores[0] = 9</code>, <code>Hero.Hp -= 1</code>) does not rebind the name, so it needs none either. <code>outer X</code> for a name with no top-level binding yet creates it when the function first assigns it. <code>for</code> and <code>with</code> variables are always local.</p>' + table(['Situation','What the checker says'],[['<code>Hits += 1</code> in a function without <code>outer Hits</code>','"\'Hits\' is assigned in \'Hit\', so it is a local there and has no value yet; … write \'outer Hits\'"'],['<code>V |&gt; Hits</code> in a function','"\'|&gt; Hits\' stores into the top-level \'Hits\'; declare \'outer Hits\'"'],['<code>outer X</code> outside a function','"\'outer\' belongs at the start of a function, node or procedure"']]) + '<p><code>on</code> phase blocks are top-level code, so <code>Frame += 1</code> inside <code>on Tick</code> changes the top-level <code>Frame</code> without a declaration. Inside <code>each</code>, a bare field name such as <code>Health</code> refers to the current entity’s column, including in a function called from the loop. Typed declarations inside functions remain restricted on the IR path; do not assume unrestricted stack-local struct declarations.</p>' + choose(['A function must change a counter, score or state that lives at the top level: <code>outer Name</code>.','A helper needs scratch variables: just assign them; they cannot clash with top-level names.'], ['Many functions change the same top-level values: consider passing them as parameters (by-ref) or grouping them in a record.','You only read the top-level value: no declaration is needed.'])),
    section('naming','Names and keywords','<p>Names are case-sensitive identifiers; builtin dispatch is generally case-insensitive, but use the documented conventional spelling. Avoid names that collide with builtins. The lexer recognizes keyword spellings case-insensitively, so even <code>BY</code> can collide with <code>by</code>. This matters for vector parameter names.</p><p>Files influence visibility and project discovery: <code>.ouro</code> source, <code>.var</code> public variable side files, <code>.ent</code> entity templates and <code>.nod</code> node files. See <a href="#modules">modules and projects</a>.</p>')
  ]);

  add('types','Language guide','Values & type checking','Automatic width selection meets a gradual, flow-insensitive checker.',[
    section('value-kinds','Value kinds', table(['Kind','Examples','Notes'],[['String','<code>"hello"</code>','Text with escape sequences and interpolation.'],['Character','<code>\'A\'</code>, <code>\'\\n\'</code>','Distinct literal kind; cross-backend support is less complete than strings.'],['Boolean','<code>true</code>, <code>false</code>','Predicates such as Has and Contains return Bool.'],['Integer','<code>42</code>, <code>42i32</code>, <code>42u64</code>','Unsuffixed literals select a fitting signed width.'],['Float','<code>1.5</code>, <code>1.5f32</code>, <code>1.5f64</code>','Width inference and printing differ from C’s simple double model.'],['Container','<code>[1, 2]</code>, <code>{ gold: 10 }</code>','Arrays and string-key maps.'],['Systems value','<code>Vec3</code>, <code>*Vec3</code>, <code>Slice(Vec3)</code>','Explicit layout/storage annotations.']]) + note('A suffix is not a universal native-width guarantee','The parser recognizes f128 and narrow numeric kinds, but some runtime/backends widen values or reject particular uses. The typed IR primarily uses i64/f64 representations. Do not infer end-to-end IEEE binary128 support from literal syntax.',true)),
    section('conversions','Converting between kinds', table(['Call','Result','Edge cases'],[[C('Str(42)'),'"42"','Floats print with up to six fraction digits, trailing zeros trimmed.'],[C('Int("17")'),'17','Invalid text gives 0; <code>Int(2.9)</code> truncates toward zero (2).'],[C('Float("2.5")'),'2.5','Parse failures are backend-sensitive; validate input first.'],[C('Bool(x)'),'true / false','Recognised name; prefer an explicit comparison such as <code>x != 0</code>.'],[C('i32(x)')+' / '+C('x |> u8'),'a whole number of that width','Any of i8 i16 i32 i64 u8 u16 u32 u64. The value must fit: <code>u8(300)</code> is the error “300 does not fit in u8”, never a silent wrap. Floats truncate toward zero; text is parsed strictly (<code>i32("abc")</code> is an error, unlike <code>Int</code>).'],[C('f32(x)')+' / '+C('x |> f16'),'a float rounded to that width','f16 f32 f64. Rounds to the nearest value of that width and prints with that width’s digits; a value beyond the width’s range is an error.']]) + code(`mut Line = "42"
mut N = Int(Line) + 1
mut Msg = "N is " + Str(N)
Msg |> Print`) + '<p>Text and numbers never convert implicitly: <code>1 + "x"</code> is a checker error with the hint “use Str() to convert”. Integer and float operands mix freely in arithmetic, and any float operand makes the result a float.</p>'),
    section('gradual-checker','Gradual inference', '<p>The checker joins all assignments to a variable; function parameters join observed call-site arguments, and return types join observed return expressions. It is flow-insensitive: it does not narrow a variable independently within every branch. The type checker is a diagnostic gate, not a proof that every dynamic operation is safe.</p>' + table(['Join','Result'],[['Same type + same type','Keep that type.'],['Str + Char evidence','Str.'],['Int + Float evidence','Dyn, rather than silently promoting every integer.'],['Array/map evidence','Join element/value types.'],['Uncertain evidence','Dyn; definite errors are still reported.']]) + code(`mut Value = 10
Value = "ten"
// Inferred Value: Dyn. Both assignments contribute evidence.`, 'Gradual value example')),
    section('diagnostics','What Chimera rejects','<p>Chimera rejects empty programs, duplicate functions, unknown calls, and use-after-<code>Own</code> moves for the frozen subset (see <code>compiler/fail_cases.txt</code> and <code>tools/ouro-fail-cases</code>). Broader ownership and gradual-checker rules described elsewhere in this handbook are language design; only the subset gate is enforced by Chimera today. Use <code>build/chimera … --dump-ast</code> when inspecting parse shape.</p>' + code('build\\chimera.exe compiler\\fixtures\\fail_unknown_fn.ouro -o build\\reject.c','Terminal','shell')),
    section('systems-inference','Systems layout inference','<p>Declared struct/pointer/slice fields carry layout information into scalar arithmetic. An integer field accumulator can remain Int instead of falling into boxed Dyn arithmetic. This is useful for hot loops, but does not replace a complete static safety or lifetime checker.</p>')
  ]);

  add('operators','Language guide','Operators & expressions','The exact surface—including the parts that are easy to misread.',[
    section('arithmetic','Arithmetic', table(['Operator','Meaning','Caveat'],[['<code>+ -</code>','Addition / subtraction','String + string concatenates; explicitly convert numbers with Str.'],['<code>*</code> / <code>×</code>','Multiplication','Prefix * is pointer dereference.'],['<code>/</code> / <code>÷</code>','Division','Exact int/int can remain integer; non-exact division can produce float.'],['<code>%</code>','Integer remainder','Not a general floating modulo API.'],['<code>^</code>','Power in math; XOR in condition grammar','Whole ^ non-negative whole is exact (<code>2 ^ 10</code> = 1024). A negative exponent or any float operand gives a correctly rounded float, the same bits in every engine: <code>2 ^ 0.5</code> = 1.4142, <code>2 ^ -1</code> = 0.5. <code>(-8) ^ 0.5</code> and <code>0 ^ -1</code> are errors.'],['<code>√</code>','Unary root','Separate from Sqrt(): <code>Sqrt(17)</code> is the whole root 4, <code>Sqrt(17.0)</code> is 4.1231.'],['<code>abs(x)</code>','Absolute value','A function outside <code>@Math</code>. <code>[x]</code> is a one-element array; the old bracket-abs reading is deprecated.'],['<code>floor(x)</code> / <code>⌊x⌋</code>','Floor','Braces with key/value entries form a map, not a floor.'],['<code>ceil(x)</code> / <code>⌈x⌉</code>','Ceiling','Unicode glyph syntax is still accepted.']]) + code(`let Exact = 6 / 2
let Fraction = 7 / 2
let Product = 4 * 0.5
Print(Exact)
Print(Fraction)
Print(Product)`) + '<p><b>Overflow is an error everywhere.</b> Whole-number arithmetic is 64-bit; a <code>+</code>, <code>-</code>, <code>*</code>, <code>^</code>, negation or <code>Abs</code> whose result does not fit stops a native program with “error: integer overflow”, and the interpreter reports the same error for that statement. Nothing wraps silently. For deliberate wrapping (hashes, random generators) mask with <code>BitAnd</code> before the value grows past 64 bits.</p>'),
    section('precedence','Precedence and associativity', '<p>Math parsing groups postfix indexing/field access, unary operators, power, multiplication/division/remainder, addition/subtraction, then coalescing and pipes. Power is right-associative; unary syntax is parsed before power. Conditions add comparisons followed by AND, XOR and OR layers. Arrows bind loosest: in statements and binding values, <code>A &gt; B |&gt; F</code> passes the comparison result to F, and <code>mut Ok = A &gt; 1 &amp;&amp; B &lt; 2</code> binds the whole condition. Call arguments, array elements and map values take full conditions too: <code>Str(N == 0)</code>, <code>[A &lt; B, C]</code>, <code>{"on": X == Y and Z}</code>. Use parentheses whenever mixing these families.</p>' + code(`let Result = (2 + 3) * 4
if ((Result > 10) and (Result < 30))
    Print("in range")
end`)),
    section('comparisons','Comparisons and logic','<p><code>== != &lt; &gt; &lt;= &gt;=</code> compare numbers or compatible strings. Strings compare lexicographically. Conditions accept <code>and / &amp; / &amp;&amp;</code> and <code>or / | / ||</code>; <code>!</code> and <code>- from</code> negate truth. Do not assume C short-circuit semantics: evaluation may be eager. Use nested if statements when avoiding a side effect or invalid access matters.</p>'),
    section('coalescing','Coalescing and conditional expressions', code(`let Defaulted = 0 ?? 10
let Choice = if (Defaulted > 5) then "large" else "small"
Print(Choice)`) + '<p><code>??</code> chooses the right side when the left is falsy; it is not a dedicated null-only option type. If-expressions require <code>then</code> and <code>else</code>; statement blocks can use familiar bare conditions. There is no null or option type; failures use <a href="#errors">Fail and <code>|?</code></a>.</p>'),
    section('ranges','Inclusive ranges', code(`mut Steps = 1..4
for I in 0..2
    Print(I)
end
mut Word = "ouroboros"
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
    section('multiline','Text on several lines', code(`mut Page = """
    <article>
      <h1>\${Title}</h1>
      <p>"Quotes" need no escaping here.</p>
    </article>
    """`) + '<p>A triple-quoted string spans lines. A line break right after the opening <code>"""</code> is dropped, and when the closing <code>"""</code> sits on its own line, its indentation is removed from every line (a line indented less than it is an error), so templates can be indented with the code. Escapes and interpolation work as in ordinary strings. A triple-quoted string can also stay on one line: <code>"""say "hi" """</code>.</p>' + choose(['HTML, SQL, JSON or any template longer than a line.','Text with many double quotes.'], ['A short message: ordinary quotes read better.','Text with a line that must start further left than the closing quotes: move the closing quotes left.'])),
    section('string-functions','Core text operations', table(['Call','Behavior'],[['<code>Str(value)</code> / <code>Int(text)</code> / <code>Float(text)</code>','Explicit conversion. Invalid Int text returns 0; Int(float) truncates toward zero.'],['<code>Len(text)</code> / <code>ByteLen(text)</code>','Characters (code points) / UTF-8 bytes: <code>Len("Café")</code> is 4, <code>ByteLen("Café")</code> is 5.'],['<code>text[a..b]</code> / <code>Slice(text, start, end)</code> / <code>text[i]</code>','Inclusive substring (clamped) / end-exclusive substring / one-character string.'],['<code>Trim / ToUpper / ToLower</code>','Unicode whitespace and full Unicode case mapping, the same in every engine: <code>ToUpper("straße")</code> is <code>STRASSE</code>, and a final Greek Σ lowercases to ς.'],['<code>Ord(c)</code> / <code>Chr(n)</code> / <code>Bytes(text)</code>','Code point of a one-character string / the character with that code / the UTF-8 bytes as an int array.'],['<code>Contains / StartsWith / EndsWith / IndexOf</code>','Search and predicates.'],['<code>Replace / PadLeft / PadRight / Repeat</code>','Text transformations; IR runtime is the preferred live path.'],['<code>Split(text, separator)</code> / <code>Join(array, separator)</code>','Split to strings / join strings. Empty split separator yields characters; trailing separators preserve empty tails.']]) + code(`let Raw = "  sword,potion  "
let Parts = Split(Trim(Raw), ",")
Print(Join(Parts, " | "))`)),
    section('unicode','Unicode and binary data', code(`mut S = "Café 日本"
Print(Len(S), ByteLen(S))      // 7 12
Print(S[3], S[5..6])           // é 日本
for C in "hé"
    Print(C, Ord(C))           // h 104, then é 233
end
Print(ToUpper("ﬁx ß"))        // FIX SS`) + '<p>Text is a sequence of characters (Unicode code points) in every engine: <code>Len</code>, <code>S[i]</code>, <code>S[a..b]</code>, <code>Slice</code>, <code>IndexOf</code>, <code>Split(S, "")</code>, <code>PadLeft</code> and <code>for C in S</code> count characters, and <code>😀</code> is one character. Case mapping and <code>Trim</code> use Unicode 14 tables shared by the interpreter and the native runtime, so a mapping can lengthen the text (<code>ß</code> → <code>SS</code>). A character is a code point, not a grapheme cluster: <code>e</code> followed by a combining accent counts as two. <code>ByteLen</code> and <code>Bytes</code> give the UTF-8 encoding for byte work.</p><p><code>ReadBin</code> / <code>WriteBin</code> use a Latin-1 byte-to-string bridge. For systems byte processing, prefer Buf or typed memory rather than treating arbitrary bytes as Unicode text.</p>'),
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
Print(Values[1..2])`) + '<p>Arrays are zero-based and support integer, float, string and nested rows. Empty arrays use <code>[]</code>; a comma distinguishes an array from absolute-value syntax. An empty <code>[]</code> takes the kind of its first <code>Push</code> (strings, integers or floats), and a float array accepts integers too. <code>[1 to 5]</code> requires ascending integer literal bounds; <code>a..b</code> takes any integer expressions and is empty when b &lt; a. <code>Arr[a..b]</code> is an inclusive, clamped slice. To transform every element, use <code>Values ||&gt; F</code> (see <a href="#pipes">edges and flows</a>). Mixed numeric literal elements promote as documented by the checker.</p>'),
    section('array-ops','Array operations','<p><code>Push(A, value)</code>, <code>Pop(A)</code>, <code>Insert(A, index, value)</code>, <code>Clear(A)</code> and <code>Len(A)</code> provide basic mutation/query operations. Nested arrays use repeated indexing, for example <code>Grid[0][1]</code>. An index out of range stops a native program and is reported and skipped by the interpreter; check <code>Len</code> first rather than relying on either.</p>'),
    section('map-literals','Maps', code(`mut Inventory = { gold: 10, potion: 2 }
Inventory["gold"] = 15
if (Has(Inventory, potion))
    Print(Get(Inventory, "potion", 0))
end
Del(Inventory, "potion")
for Key, Value in Inventory
    Print(Key, Value)
end`) + '<p>Unquoted literal keys become strings. Some builtin key positions accept bare identifier names as keys, not variable lookups. Quote a key when you want its meaning to be unambiguous. <code>Get</code> supplies an explicit missing-key default. <code>Keys</code> and <code>Values</code> extract collections.</p>'),
    section('nested-data','Nested data', code(`mut Site = {"name": "Ouro", "post": {"title": "Hello", "views": 3}, "tags": ["a", "b"]}
Site["post"]["title"] |> Print          // Hello
Site["post"]["views"] = 4              // writes through the path
mut Posts = [{"title": "One"}, {"title": "Two"}]
Push(Posts, {"title": "Three"})
for P in Posts
    P["title"] |> Print
end
mut Data = FromJson(Read("posts.json"))    // the same shapes from JSON
for P in Data
    P["title"] |> Print
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
[Health < 5] |> Alert()`) + '<p>Write conditions directly: <code>if Health &lt; 5</code> and <code>while Ready</code>. Parenthesized conditions remain valid. Use <code>elseif</code>, <code>else if</code>, or <code>elif</code> for branches. A typo hint is only shown when the checker finds a genuinely close, different name; it never auto-corrects your code. A bracket condition followed by a call is a tag gate. A single-line <code>if (condition) -&gt; Call()</code> form is also accepted.</p>'),
    section('loops','While and counted for', code(`mut I = 0
while (I < 3)
    Print(I)
    I += 1
end

for mut N = 3 to 1 by -1
    Print(N)
end`) + '<p><code>for … to</code> has inclusive bounds and optional <code>by</code> step. Use a nonzero step whose sign reaches the endpoint. The recommended assignment spelling does not remove the legacy <code>:=</code> loop syntax (prefer <code>mut i =</code>).</p>'),
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
    section('arrow-control','Guards, match, and while', code(`mut Speed = 6
Speed | when Speed > 1 |> Hello
Speed | when Speed < 8 |>
    "under" |> Print
end
mut Count = 0
while Count < 3
    Count++
end
mut Cmd = "stop"
Cmd | match
    It == "start" -> "go"
    It == "stop" -> "halt"
    _ -> "?"
end |> Print`) + '<p>Edge forms sit beside block statements: <code>| when c |&gt;</code> continues only while the guard holds (a following indented block ends at <code>end</code>), <code>| match … end |&gt;</code> picks the first matching arm, and an ordinary <code>while</code> loop stays inside a box. Both styles compile to the same code; see <a href="#pipes">edges &amp; flows</a> for the full vocabulary.</p>'),
    section('with','With bindings','<p><code>with mut Slot = FindId(Player, id) … end</code> runs the body only when the value is considered present. FindId has a special nonnegative-index check; do not equate presence with generic truthiness when index zero is valid. See entity relations for <code>Entity@id</code> sugar.</p>')
  ]);

  add('functions','Language guide','Functions & calls','Value returns, procedures, defaults, and the mutation model.',[
    section('fn-void','fn and void', code(`fn Scale(Value, Factor = 2)
    return Value * Factor
end
void Announce(Text)
    Print(Text)
end
Print(Scale(4))
Announce("ready")`) + '<p><code>fn</code> is value-returning; <code>void</code> is a procedure. <a href="#nodes">Nodes</a> are the port-based alternative and are called the same way. A bare return leaves a procedure. A default is written <code>name = value</code> and fills a trailing parameter when the caller leaves it out.</p>'),
    section('fn-defaults','Defaults, typed parameters and mut', '<p>Parameters are inputs. A default makes a parameter optional at the call site, which is the right tool when most callers want the same value. Defaults are filled from the right, so only trailing parameters can be omitted. A type after the name (<code>a: i32</code>) matters for systems code and node ports; for script values leave it off and let inference choose.</p>' + code(`fn Pick(a, b = 10, c = 100)
    return a + b + c
end
Print(Pick(1), Pick(1, 2), Pick(1, 2, 3))     // 111  103  6

fn Scale(v, f = 2)
    return v * f
end
Print(Scale(3), Scale(3, 4))                  // 6  12

fn Tally(list)
    mut n = 0                                 // a local, reset every call
    for x in list
        n += x
    end
    return n
end
Print(Tally([1, 2, 3]))                       // 6`, 'Defaults') + table(['Parameter form','Meaning'],[['<code>fn F(a)</code>','Required input. The body may read it freely.'],['<code>fn F(a, b = 2)</code>','Optional: <code>F(1)</code> behaves as <code>F(1, 2)</code>.'],['<code>fn F(a: i32)</code>','Typed parameter for systems code; the argument must fit the type.'],['<code>void Bump(mut x)</code>','Contract spelling for "this procedure changes its argument". The parser in this checkout does not accept <code>mut</code> on a bare parameter yet; write <code>void Bump(x)</code> and name the procedure for the change it makes.']]) + '<p>Whether a change to a parameter reaches the caller is decided by the rule in <a href="#functions">Parameter mutation</a> below: it lands in a top-level variable passed by name, and is a private copy for a literal, an expression or a local of the caller. Do not rely on a callee mutating a local of its caller; return the new value instead.</p>' + related([['bindings','Bindings &amp; scope'],['types','Values &amp; type checking'],['nodes','Nodes &amp; .nod files']])),
    section('parameter-mutation','Parameter mutation','<p>When a function changes a parameter, by assigning it (<code>=</code>, <code>+=</code>, <code>++</code>) or growing or shrinking it (<code>Push</code>, <code>Pop</code>, <code>Insert</code>, <code>Clear</code>, <code>Del</code>), and the caller passed a top-level variable by name, the change lands in that variable. Every other argument is a copy: a literal, an expression, or a variable local to the calling function. The rule is the same in every engine. Natively, passing such a parameter on to another function that also changes it is refused.</p>' + code(`void Increase(N)
    N += 1
end
fn AddPair(Items, X)
    Push(Items, X)
    Push(Items, X * 10)
end
mut Counter = 4
Increase(Counter)
Print(Counter)        // 5
mut Bag = [1, 2]
AddPair(Bag, 3)
Print(Bag)            // [1, 2, 3, 30]`) + note('Be explicit about mutation','This is not C’s default pass-by-value model. Use procedures with clearly named mutations, and validate aliasing behavior on the backend you intend to ship.')),
    section('recursion','Recursion and frames','<p>The C and x64 backends have real frames and support recursion and mutual recursion. Native workers receive their arguments through the ABI.</p>'),
    section('ufcs','Uniform function-call syntax', code(`let Words = ["one", "two"]
Print(Words.Len())
let Clean = "  HELLO  " |> Trim() -> ToLower()
Print(Clean)`) + '<p><code>receiver.Method(args)</code> and value pipes insert the receiver as an argument. This is call syntax sugar, not a class/object method system. Traits provide explicit dynamic dispatch; records and structs remain distinct data models.</p>'),
    section('fn-results','Getting results out: return, parameters, outer', '<p>There are three ways for a function to affect the rest of the program. Prefer the first; it keeps data flow visible in the chain. Use the second for small mutators that name their effect. Use the third when a function owns a piece of shared state such as a counter or a score, and declare it with <code>outer</code> so the checker and the reader both see the write.</p>' + code(`// 1. Return a value: the default choice.
fn Triple(n)
    return n * 3
end

// 2. Change a top-level variable passed by name.
void Bump(n)
    n += 1
end

// 3. Write shared state declared with outer.
mut hits = 0
void Hit()
    outer hits
    hits += 1
end

mut score = 4
Bump(score)
Hit()
Hit()
Print(Triple(2), score, hits)         // 6  5  2

void Wrap()
    mut local = 1
    Bump(local)                       // a local of the caller: Bump gets a copy
    Print(local)                      // 1
end
Wrap()`, 'Three ways out') + choose(['<code>return</code>: the result feeds a chain (<code>x |&gt; Triple |&gt; Print</code>).','<code>outer Name</code>: one function owns a counter, score or flag at the top level.','A mutating parameter: a tiny helper like <code>Push</code> that is obviously a mutator.'],['Many functions write the same top-level values: pass a record or group them in an entity.','You only read a top-level variable: no declaration is needed.','The value is a local of the caller: return it.']) + related([['bindings','Bindings &amp; scope'],['pipes','Edges &amp; flows']])),
    section('fn-vs-node','fn, void or node?', '<p>A <code>fn</code> is the default box: inputs in, one value out. A <code>void</code> is the same box for effects only. A <code>node</code> names its ports, so it fits when a call produces several named results or when the box lives in a shared <code>.nod</code> library. All three are called the same way, with <code>F(a, b)</code> or <code>a, b |&gt; F</code>.</p>' + table(['','<code>fn</code>','<code>void</code>','<code>node</code>'],[['Inputs','Parameters','Parameters','<code>in[a, b]</code> ports'],['Result','One value via <code>return</code>','None','Each <code>out[…]</code> port; several become a record'],['Early exit','<code>return</code>','Bare <code>return</code>','No <code>return</code>; set ports and end'],['Where it lives','Any <code>.ouro</code>','Any <code>.ouro</code>','Any <code>.ouro</code> or a <code>.nod</code> category'],['Reads best as','A calculation','An action','A component with named inputs and outputs']]) + code(`fn Sum(a, b)
    return a + b
end

node Calc in[a, b] out[sum, diff]
    a + b |> Out.sum
    a - b |> Out.diff
end

let r = Calc(9, 4)
Print(Sum(9, 4), r.sum, r.diff)       // 13  13  5`, 'The same box as a fn and as a node') + '<p>If a function returns one value and is used in one place, keep it a <code>fn</code>. Promote it to a <code>node</code> when you find yourself returning a map just to carry two results.</p>' + related([['nodes','Nodes &amp; .nod files'],['project-files','Project files'],['pipes','Edges &amp; flows']]))
  ]);

    add('pipes','Language guide','Edges & flows','Values flow left to right through nodes — a textual node graph.',[
    section('pipe-family','The edge family', table(['Syntax','Meaning'],[['<code>x |&gt; F |&gt; G</code>','Pipe: x is the first argument of F, F’s result the first of G. <code>F(a)</code> adds args after the subject.'],['<code>a, b |&gt; F</code>','Fan-in: every input is an argument, in order (no parentheses after F). Same arity rule as every pipe.'],['<code>Items |&gt; F from seed</code>','Fold: <code>F(acc, item)</code> for each item; <code>parallel Items |&gt; F from seed</code> for any-order / parallel-safe folds.'],['<code>Group ||&gt;&gt; Node</code>','Parallel each: <code>Node(Slot)</code> for every entity on the job workers.'],['<code>X |=&gt; Y</code> / <code>X |+&gt; A, B</code> / <code>X |-&gt;</code>','Ownership edges: move, share, drop (see <a href="#ownership">Arenas, Own &amp; Rc</a>).'],['<code>x | when c |&gt; F</code>','Guard: continue only while c holds.'],['<code>| when c |&gt; F</code>','Empty left: run F with no subject when c holds.'],['<code>xs ||&gt; F</code>','Map each: every item through F; results form an array.'],['<code>xs ||&gt; F when pred</code>','Filtered map; use <code>It</code> / binder in the predicate.'],['<code>x | match … end |&gt; Dest</code>','Match router: first matching arm’s value flows on.'],['<code>x |&gt; Name</code>','Store into an existing variable, field or element.'],['<code>f |? Handler</code>','Catch: a Fail inside f runs Handler with its message.'],['<code>Q |! chain</code>','Reactive watch: rerun the chain whenever Q is written.'],['<code>A() =&gt; B()</code>','Sequence side-effect calls.'],['<code>x |&gt; as Name</code> / <code>x |&gt; then A else B</code>','Bind the subject, or choose a stage.']]) + code(`mut N = -5 |> Abs |> Clamp(0, 3)
N |> Print
3, 9 |> Max |> Print
mut Line = "x,y"
Line, "," |> Split |> Len |> Print`) + note('One arity rule','<code>A, B |&gt; F</code> fans several values into F. There is no separate funnel glyph.') + '<p>Full contract: <a href="SYNTAX_GRAPH.md">SYNTAX_GRAPH.md</a>. Legacy arrows (<code>-&gt;</code>, <code>~&gt;</code>, …) still parse unless <code>OURO_GRAPH_STRICT=1</code>.</p>'),
    section('pipe-conditions','Guards', code(`mut Speed = 6
"big" | when Speed > 1 |> Print
"never" | when Speed > 99 |> Print
mut R = Speed |> Double | when Speed > 1 |> Add(1)
if Speed < 8
    "under" |> Print
end`) + '<p><code>| when c |&gt;</code> forwards the value only when c holds. Prefer ordinary <code>if</code> / <code>while</code> inside a node for multi-statement control; edges carry topology between nodes.</p>'),
    section('pipe-loops','Map and loops', code(`mut Count = 0
while Count < 3
    Count++
end
while Count < 6
    Count |> Print
    Count++
end
mut Nums = [1, 2, 3, 4]
mut D = Nums ||> Double
mut Words = ["a", "bb", "ccc"]
Words ||> Print
0..2 ||> Print`) + '<p><code>xs ||&gt; F</code> sends each item through F and collects results; void results are dropped. Loop-as-edge (<code>~[c]~&gt;</code>) is retired — use <code>while</code> inside the node. With an entity on the left, <code>Group ||&gt; Node</code> calls <code>Node(Slot)</code> for each entity.</p>'),
    section('pipe-folds','Folds', code(`fn Add(A, B)
    return A + B
end
mut Nums = [1, 2, 3, 4]
mut Total = Nums |> Add from 0
mut Big = Nums |> Max from Nums[0]
Nums |> Add from 0 |> Print
parallel Nums |> Add from 0 |> Print
Nums, 1, 2 |> Slice |> Print`) + '<p><code>Items |&gt; F from Start</code> folds left to right. <code>parallel … |&gt; F from Start</code> marks an associative fold that may run on every core when F is parallel-safe. F takes two arguments and returns a value.</p>'),
    section('pipe-entity','Flows over entities', code(`entity Player
    mut Score = 0
    mut Rank = "?"
    mut Hp = 10
end
void Walk(S)
    Print("walk " + Str(S))
end
void Heal(S)
    Hp += 1
end
Player | when Score > 50 |> Walk
Player ||>> Heal`) + '<p><code>Group | when c |&gt; Node</code> calls <code>Node(Slot)</code> where c holds. <code>Group ||&gt;&gt; Node</code> runs on the job workers. Prefer <code>each e in Group</code> binders for local field logic. While parallel jobs run, heap retain/release is atomic and Print is locked.</p>'),
    section('pipe-stores','Storing results', code(`mut R = 0
Nums |> Len |> R
mut P = 5
P |> Double |> P
mut Box = [0, 0]
7 |> Box[1]`) + '<p>A bare name at the end of a flow stores into an existing variable; it never declares one. Fields and elements work the same way.</p>'),
    section('pipe-match','Match routers', code(`fn Label(N)
    return N | match
        0 -> "zero"
        It < 0 -> "negative"
        _ -> "positive"
    end |> Trim
end
mut Cmd = "stop"
mut Code = 0
Cmd | match
    "start" -> 1
    "stop" -> 2
    _ -> 0
end |> Code`) + '<p>Arms are tried in order. A literal head uses <code>==</code>; other heads are conditions with <code>It</code> as the subject. <code>_</code> is the else arm. Statement form <code>match x … end</code> is the same router inside a box.</p>'),
    section('pipe-catch','Fail and catch', code(`fn Parse(S)
    Len(S) | when Len(S) == 0 |> Fail("empty input")
    return Int(S)
end
fn Log(M)
    "caught: " + M |> Print
    return -1
end
mut A = "21" |> Parse |? Log
mut B = "" |> Parse |? Log`) + '<p><code>Fail("message")</code> unwinds to the nearest <code>|?</code>. See <a href="#errors">errors and Fail</a>.</p>'),
    section('pipe-reactive','Reactive bindings', code(`fn Double(X)
    return X * 2
end
mut Q = 1
mut R = 0
Q |! Double |> R
mut Q = 5
R |> Print`) + '<p><code>Q |! chain</code> runs when Q is bound and after every whole-value write to the outer Q. Element and field writes do not trigger a rerun yet.</p>'),
    section('pipe-retired','Legacy forms', table(['Old form','Now'],[['<code>x -&gt; F</code> / <code>a, b &gt;- F</code>','<code>x |&gt; F</code> / <code>a, b |&gt; F</code>'],['<code>xs ~&gt; F</code>','<code>xs ||&gt; F</code>'],['<code>Body ~&gt;&gt; F</code>','<code>Body ||&gt;&gt; F</code>'],['<code>xs, 0 &gt;~ Add</code>','<code>xs |&gt; Add from 0</code>'],['<code>|?</code> / <code>-|&gt;</code>','<code>|?</code> / <code>|!</code>'],['<code>-[c]-&gt;</code>','<code>| when c |&gt;</code>'],['<code>--&gt;</code> / <code>-+-&gt;</code> / <code>-|-&gt;</code>','<code>|=&gt;</code> / <code>|+&gt;</code> / <code>|-&gt;</code>']]) + '<p>Set <code>OURO_GRAPH_STRICT=1</code> to reject legacy glyphs. Prefer <code>abs(x)</code> outside <code>@Math</code>; write comparisons as <code>a &gt; -1</code> with spaces.</p>'),
    section('pipe-status','Coverage','<p>Every form on this page runs in the interpreter and on the C and x64 backends. Regression case <code>tests/bug/cases/graph_dialect.ouro</code> exercises the preferred edges; older cases still cover legacy spellings during the dual-accept window.</p>')
  ]);

add('nodes','Language guide','Nodes & .nod files','Named units with typed In and Out ports, callable like functions.',[
    section('node-def','Declaring a node', code(`node Damage in[Health: i32, Amount: i32] out[Health: i32, Dead: bool]
    Amount | when Amount < 0 |> Fail("negative damage")
    Health - Amount |> Out.Health
    Health - Amount <= 0 |> Out.Dead

node Grade in[Score] out[Label]
    Score | match
        It >= 90 -> "A"
        It >= 70 -> "B"
        _ -> "C"
    end |> Out.Label`) + '<p><code>in</code> ports are the parameters; write <code>name: Type</code> when width matters. Each <code>out</code> port is a local set with <code>value |&gt; Out.Port</code>. It starts from the in-port with the same name (there is no write-back to the caller), otherwise from zero. The body is indented or closed by <code>end</code>. Nodes have no <code>return</code> — every result leaves through an out port.</p>' + related([['pipes','Edges & flows'],['functions','Functions & calls'],['SYNTAX_GRAPH.md','SYNTAX_GRAPH.md']])),
    section('node-calls','Calling a node', code(`mut R = Player_Health, 12 |> Damage
R.Health |> Print
R.Dead |> Print
95 |> Grade |> Print
mut Scores = [50, 99]
Scores ||> Grade |> Print`) + '<p>Call a node like a function or through an edge: <code>Damage(H, A)</code>, <code>H, A |&gt; Damage</code>, <code>X |&gt; Grade</code>, <code>Xs ||&gt; Grade</code>. One out port → that value. Several → a record of the ports (bools as 0/1). None → no value. <code>Damage.Dead</code> alone is an error; bind the call result first.</p>'),
    section('node-vs-fn','When a node beats a function', table(['Need','Prefer'],[['One result, early <code>return</code>, recursion','<code>fn</code>'],['Several named results (health + dead flag)','<code>node … out[…]</code>'],['Same unit called as call / pipe / map','node — one definition, every call shape'],['Logic shared across a project as a category','<code>.nod</code> file (<code>Physics.Damage</code>)']]) + '<p>A node is a box with ports. A function is a value-returning computation. If you find yourself returning a map of results just to name them, that is usually a node.</p>'),
    section('nod-files','.nod files and categories', code(`// Physics.nod
node Heal in[Hp, Amount] out[Hp]
    Hp + Amount |> Out.Hp

// Magic.nod
node Heal in[Hp] out[Hp]
    Hp + 1 |> Out.Hp

// main.ouro
10, 5 |> Physics.Heal |> Print
10 |> Magic.Heal |> Print`) + '<p>A <code>.nod</code> file holds node definitions only. Discovery matches <code>.ent</code> (script tree + ancestors) unless an <code>ouroboros.project</code> manifest lists paths explicitly. The file stem is the category: qualify when the same name exists in more than one (<code>Physics.Heal</code>). A node may not share a function’s name.</p>' + related([['modules','Modules & project structure'],['project-files','Project files']]))
  ]);

  add('errors','Language guide','Errors & Fail','Raise a failure with a message and catch it where it makes sense.',[
    section('fail','Raising and catching', code(`fn Parse(S)
    Len(S) | when Len(S) == 0 |> Fail("empty input")
    return Int(S)
end
fn Twice(S)
    return Parse(S) * 2
end
fn Log(M)
    ("caught: " + M) |> Print
    return -1
end
"" |> Twice |? Log |> Print
"5" |> Twice |? Log |> Print`) + '<p><code>Fail</code> carries a string message. It unwinds through calls to the nearest <code>|?</code>; the handler receives the message and its value replaces the failed result. A handler can be any node, function or builtin that takes a string, for example <code>|? Print</code>.</p>'),
    section('uncaught','Uncaught failures', code(`void Tick1()
    "tick start" |> Print
    Fail("tick broke")
    "never" |> Print
end
void Tick2()
    "second system" |> Print
end
on Tick
    Tick1()
    Tick2()
end`) + '<p>Inside a phase (an <code>on</code> block or a manual <code>Tick()</code> call) an uncaught Fail prints <code>fail: message</code> and ends that phase: above, <code>"never"</code> and <code>Tick2</code> are skipped for this tick, and the program carries on after the phase. Anywhere else it prints <code>fail: message</code> and stops the program; a native executable exits with status 1.</p>'),
    section('error-model','What Fail is not','<p>There is no exception type hierarchy, no <code>finally</code>, and no null or option type. Fail is a message-carrying early exit with one catch operator. Use ordinary values and conditions for expected outcomes, and Fail for failures a caller may want to handle.</p>'),
    section('err-vs-runtime','Fail versus runtime errors', '<p>Three different things are called "errors". Only the first one is something your program chooses to raise and can recover from. The other two mean the program or its input is wrong, and they are best prevented rather than caught.</p>' + table(['Kind','Raised by','Can <code>|?</code> handle it?','What happens'],[['<code>Fail(&quot;msg&quot;)</code>','Your own code, on purpose','Yes','Unwinds to the nearest <code>|?</code>. With none, ends the current phase (<code>fail: msg</code>) or stops the program.'],['Checker error','The static checker, before the program runs','No, it is not a run-time event','The program does not start. Fix the source; <code>--no-check</code> skips the gate but not the meaning.'],['Run-time error','The runtime: integer overflow, <code>u8(300)</code>, an index out of range, an invalid value for a builtin','Not documented as catchable; do not rely on it','A native program stops with an <code>error:</code> message; the interpreter reports the statement and skips it.']]) + code(`// Prevent the run-time error, and Fail where the caller can decide.
fn Pick(items, i)
    "index \${i} out of range" | when i < 0 or i >= Len(items) |> Fail
    return items[i]
end
fn Fallback(m)
    Print("pick failed: \${m}")
    return 0
end

let xs = [10, 20, 30]
Pick(xs, 1) |> Print                  // 20
Pick(xs, 7) |? Fallback |> Print      // pick failed: index 7 out of range, then 0`, 'Guarding an index') + '<p>Use <code>Fail</code> when a caller could reasonably recover (bad user input, a missing file, a parse error). Use a return value when "nothing there" is an ordinary answer, and validate with <code>Len</code>, <code>Has</code> or a range test before an operation that would otherwise be a run-time error.</p>' + related([['errors','Errors &amp; Fail'],['types','Values &amp; type checking'],['collections','Arrays &amp; maps']])),
    section('err-placement','Where to put |?', '<p><code>|?</code> attaches to the chain on its left. If anything in that chain fails, the handler runs with the message and its return value replaces the result of the chain at that point, so the statements after <code>|?</code> keep running. The nearest <code>|?</code> up the call stack wins. Placement therefore decides how much work a failure cancels: put the handler on the smallest chain that has a sensible fallback.</p>' + code(`fn Parse(s)
    "empty input" | when Len(s) == 0 |> Fail
    return Int(s)
end
fn Log(m)
    Print("caught: \${m}")
    return -1
end
fn Twice(s)
    return Parse(s) * 2
end

// Handler at the source: the failed Parse becomes -1, the rest still runs.
fn TwiceSafe(s)
    let n = s |> Parse |? Log
    return n * 2
end

"" |> TwiceSafe |> Print              // caught: empty input   then  -2
// Handler at the caller: the whole of Twice is replaced by -1.
"" |> Twice |? Log |> Print           // caught: empty input   then  -1
"4" |> Twice |? Log |> Print          // 8`, 'Placement') + table(['Place it','Effect','Pick it when'],[['Right after the risky step','The failure becomes a default and the function continues.','A default value is genuinely correct.'],['On the call that does a bundle of work','The whole bundle is skipped and replaced by one value.','Partial progress is meaningless.'],['Around each system in a phase','One system fails, the others still run (see below).','Independent systems share a frame.'],['Nowhere','The failure ends the phase or the program.','A broken invariant should be loud.']]) + '<p>A handler can be any function or builtin that takes a string, including <code>Print</code>. Keep handlers small: log, return a default, or raise again with more context (see the patterns below).</p>' + related([['pipes','Edges &amp; flows'],['functions','Functions &amp; calls']])),
    section('err-phase','Fail across independent calls', '<p>When several procedures share one frame of work, catch failures per call so the rest still run. The pattern is the same whether you call them from a top-level script or from your own loop.</p>' + code(`void Physics()
    Print("physics")
    Fail("physics broke")
end
void AI()
    Print("ai")
end
fn Report(m)
    Print("system failed: \${m}")
end

Physics() |? Report
AI()`, 'A fail per system') + code(`physics
system failed: physics broke
ai`, 'Output', 'text') + '<p>Without the <code>|? Report</code>, the output would stop after <code>physics</code> and the failure message, and <code>AI</code> would not run.</p>' + related([['control-flow','Control flow'],['project-files','Project files']])),
    section('err-patterns','Patterns and examples', '<p>Three shapes cover most uses. Each is small enough to copy as is.</p>' + code(`// 1. Guard at the top of the function: fail early, keep the body flat.
fn Withdraw(balance, amount)
    "amount must be positive" | when amount <= 0 |> Fail
    "insufficient funds" | when amount > balance |> Fail
    return balance - amount
end

// 2. Re-raise with more context.
fn Load(s)
    "no data" | when Len(s) == 0 |> Fail
    return Int(s)
end
fn Wrap(m)
    Fail("load failed: \${m}")
end
fn Config(s)
    return s |> Load |? Wrap
end

// 3. Log and continue with a default.
fn Note(m)
    Print("warning: \${m}")
    return 0
end
let a = 50 |> Withdraw(20)              // 30 (subject is the first argument)
let b = 5 |> Withdraw(20) |? Note       // warning: insufficient funds, then 0
"" |> Config |? Print                   // load failed: no data
Print(a, b)`, 'Patterns') + choose(['A caller may want to recover: bad input, missing resource, parse failure.','You need a message that names the cause.','An invariant is broken and the phase should stop.'],['"Not found" is a normal answer: return a sentinel and test it.','You need to know whether a key exists: <code>Has(M, &quot;k&quot;)</code>.','You are inside a hot loop and only checking a bound: test it with <code>if</code>.']) + note('No hierarchy, no finally','A failure is a message and an early exit. There is no exception type to match, no cleanup block and no null. Release resources (see <a href="#ownership">Arenas, Own &amp; Rc</a>) before you call <code>Fail</code>, or in the handler.') + related([['tour','A practical language tour'],['ownership','Arenas, Own &amp; Rc'],['decisions','Which form should I use?']]))
  ]);

  add('records','Language guide','Records & enums','Separate flexible named values from fixed-layout systems data.',[
    section('record-templates','Record templates', code(`record Hero
    mut Name = "Ada"
    mut Health = 100
end
mut H = Hero{}
H.Health = 80
Print(H.Name)
Print(GetField(H, "Health"))`) + '<p><code>NewRecord(Hero)</code>, <code>NewRecord("Hero")</code> and <code>Hero{}</code> create a heap record from defaults. Field access on heap records/maps routes through field helpers. Nested defaults can flatten into dotted keys, with prefix reconstruction for subrecords/arrays.</p>'),
    section('flat-records','Flat instances and conversion', '<p>The compatibility form <code>mut H = Hero</code> expands fields into names like <code>H_Health</code>. <code>H.Health</code> can resolve that flat representation. <code>ToMap(H)</code> / <code>Pack(H)</code> collect fields; <code>Unpack(M, H)</code> writes matching instance fields, and <code>Unpack(Parts, H)</code> with a string array (for example from <code>Split</code>) fills the fields in declaration order, converting as <code>Int()</code> / <code>Float()</code> do (text that is not a number gives 0 / 0.0; a non-zero number makes a bool field true), and leaves fields past the end of the array unchanged; <code>Clone(A, B)</code> copies flat instances. This is a different representation from a fixed C-layout struct.</p>' + note('Avoid accidental representation changes','Choose either heap records for flexible named values or typed structs/slices for memory layout. Do not treat record syntax as a native ABI struct.')),
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
    Missing = 404
    Broken = 500
end`, 'Explicit discriminants') + '<p>Enums use C-like i32 discriminants. Variants default to sequential values starting at 0; <code>Name = 404</code> assigns an integer literal explicitly. They are not algebraic variants with payloads. Prefer <code>match</code> / <code>switch</code> over long <code>if</code> chains when switching on a closed set of states.</p>'),
    section('record-vs-struct','Record vs struct vs map', table(['Shape','Use when','Avoid when'],[['<code>record</code> + <code>Hero{}</code>','Named fields with defaults, gameplay data','You need C layout or pointers into the value'],['<code>struct</code>','Exact widths, offsets, slices, FFI','You want open-ended keys or defaults'],['map <code>{ k: v }</code>','Open string keys, JSON-shaped data','Keys are a fixed schema — a record reads better']])+ related([['structs','Structs & pointers'],['collections','Collections'],['ownership','Ownership']])),
    section('record-ops','Clone, Pack, Unpack', code(`record Item
    mut Name = "coin"
    mut Qty = 1
end
mut A = Item{}
A.Qty = 3
mut M = Pack(A)
mut B = Item{}
Unpack(M, B)
Print(B.Name, B.Qty)`) + '<p><code>Pack</code> / <code>ToMap</code> collect fields; <code>Unpack</code> writes them back (including from a string array in declaration order). <code>Clone</code> copies flat instances. Prefer heap <code>Hero{}</code> for new code; flat <code>mut H = Hero</code> expand is retired under <code>OURO_GRAPH_STRICT</code>.</p>')
  ]);

  add('modules','Language guide','Modules & project structure','Imports, includes, exports, side files, and package discovery.',[
    section('file-model','The file model', table(['Extension','Role'],[['<code>.ouro</code>','Executable source; private script bindings.'],['<code>.var</code>','Public variable side file, auto-loaded in the same folder.'],['<code>.ent</code>','Public entity templates; discovered recursively in the script tree and up to three ancestor levels.'],['<code>.nod</code>','Node definitions only, discovered like <code>.ent</code>; the file stem is the node category. See <a href="#nodes">nodes</a>.']]) + '<p>File topology does not decide threading: <code>use</code> and <code>include</code> stay the way code is shared. <code>on</code> phase blocks belong to the main program; a module brought in with <code>use</code> may not declare them.</p>' + note('Implicit discovery matters','Adding an .ent or .var file can affect nearby programs even without an explicit use statement. Keep test fixtures isolated and inspect the resolved project context.')),
    section('use','Library imports', code(`use "lib/"
// In lib/mod.ouro:
fn Scale(Value, Factor)
    return Value * Factor
end

// Another file, and a side file that lives in another folder:
use "util.ouro"
use "../shared/world.var"`) + '<p><code>use</code> imports supported library definitions and side files. A package directory such as <code>lib/</code> resolves to its <code>mod.ouro</code>; explicit <code>.ouro</code> and <code>.var</code> paths work for file imports. Nested imports resolve relative to source files.</p><p><code>export</code> controls exposed callables in supported module workflows; it is not arbitrary top-level execution. The interpreter and the native backends resolve imports the same way, while preparing the program.</p>'),
    section('mod-export','export and what stays private', '<p>A module is a <code>.ouro</code> file that other programs bring in with <code>use</code>. Nothing in it is visible until it is exported: functions and nodes that are not listed in <code>export</code> stay private to the module, so you can change helpers without breaking users. A package directory such as <code>lib/</code> resolves to its <code>mod.ouro</code>.</p>' + code(`// lib/mod.ouro
fn Scale(v, f)
    return v * f
end
fn Hidden(v)             // private helper
    return v + 1
end
export Scale`, 'lib/mod.ouro') + code(`// main.ouro
use "lib/"
Print(Scale(4, 3))       // 12
Print(Hidden(1))         // error: 'Hidden' is not exported from lib/mod.ouro`, 'main.ouro') + '<p>Exports cover callables. A module may not declare <code>on</code> phase blocks, since those belong to the main program. To share plain values between scripts in one folder, use a <code>.var</code> side file instead; see <a href="#project-files">Project files</a>.</p>' + note('use is for modules, packages and side files in other folders','A same-folder <code>.var</code> loads automatically. Writing <code>use &quot;world.var&quot;</code> for it as well reports that the public variable is already declared.',true) + related([['project-files','Project files'],['nodes','Nodes &amp; .nod files'],['functions','Functions &amp; calls']])),
    section('include','Source inclusion', code(`include "systems.ouro"
include "systems/"`) + '<p><strong>Retired.</strong> The graph dialect uses <code>use</code> for every import; <code>include</code> still parses with a warning and is an error under <code>OURO_GRAPH_STRICT=1</code>. <code>include</code> splices full executable source, systems and definitions. Directory inclusion processes .ouro files in sorted order. Error messages can chain the parent include site and child location.</p>'),
    section('mod-sidefiles','Choosing between use, include and side files', '<p><code>use</code> is the one import statement of the graph dialect. <code>include</code> splices a file in as if you had typed it, which makes names collide and hides where things come from; it still parses but is retired and is an error under <code>OURO_GRAPH_STRICT=1</code>. Side files exist for data that many scripts need without any statement at all.</p>' + table(['You want to','Use','Notes'],[['Reuse functions or nodes from another file','<code>use &quot;lib/&quot;</code> plus <code>export</code>','Only exported names are visible; a directory resolves to <code>mod.ouro</code>.'],['Reuse one specific file','<code>use &quot;util.ouro&quot;</code>','Replaces <code>include &quot;util.ouro&quot;</code>.'],['Share values in one folder','a <code>.var</code> file','Loaded automatically, names are public. Constants stay constant.'],['Share entity archetypes project-wide','a <code>.ent</code> file','Found by discovery or the manifest. Columns are named <code>Entity_Field</code>.'],['Share a library of nodes by category','a <code>.nod</code> file','The file stem is the category: <code>Physics.Heal</code>.'],['Share components for entities','a <code>.com</code> file','<code>entity E uses A, B</code> pulls the fields in.'],['Notation for formulas','a <code>.dom</code> file','Only active inside an <code>@Name</code> block.']]) + code(`// Physics.nod
node Heal in[hp, amount] out[hp]
    hp + amount |> Out.hp
end

// main.ouro: no use statement needed, the .nod file is discovered
10, 5 |> Physics.Heal |> Print      // 15`, 'A node library category') + '<p>Because discovery can change what a program sees, keep each project in its own folder tree and consider a manifest (below). See <a href="#project-files">Project files</a> for one worked example of each side file.</p>' + related([['project-files','Project files'],['quickstart','Installation &amp; first program'],['nodes','Nodes &amp; .nod files']])),
    section('project-entry','Entry points and compilation','<p>CLI directory arguments resolve to <code>main.ouro</code>. A native build prepares the whole program, imports included, and produces one executable; there are no separately compiled module objects.</p>'),
    section('mod-manifest','The ouroboros.project manifest', '<p>By default, <code>.ent</code>, <code>.com</code>, <code>.nod</code> and <code>.dom</code> files are found by scanning the script folder tree and up to three ancestor folders. That is convenient for a one-folder program and surprising in a monorepo, where a distant file can add an entity to your program. A manifest named <code>ouroboros.project</code> in the project root replaces the scan with an explicit list, and keeps the same-folder <code>*.var</code> files.</p>' + code(`# ouroboros.project  (project root)
entities:
  - entities/player.ent
  - entities/mob.ent
components:
  - components/combat.com
nodes:
  - nodes/damage.nod
domains:
  - domains/vec.dom`, 'ouroboros.project', 'text') + code(`game/
  ouroboros.project
  main.ouro                  tools/ouro_run.bat game/main.ouro
  world.var                  still loaded: same folder
  entities/  player.ent  mob.ent
  components/  combat.com
  nodes/  damage.nod
  domains/  vec.dom
  lib/  mod.ouro             use "lib/"`, 'Layout', 'text') + '<p>Paths are written relative to the project root. A file that exists on disk but is not listed is not loaded, which is the point: the list is the single place that says what the project contains. Start without a manifest, and add one when the project grows beyond one folder or when two programs share an ancestor folder.</p>' + related([['project-files','Project files'],['quickstart','Installation &amp; first program']]))
  ]);

  add('project-files','Language guide','Project files: .var, .com, .ent, .nod, .dom','Side files declare shared values, components, entity archetypes, node libraries and notation domains that every script in a project can see.',[
    section('pf-overview','What each file holds', table(['File','Holds','Visible to','Discovered'],[[C('.ouro'),'Program code: statements, functions, nodes, on blocks','Itself (bindings are private)','Run directly, or through use / include'],[C('.var'),'Public variable bindings','Every .ouro in the same folder','Same folder, automatically; or <code>use "x.var"</code>'],[C('.ent'),'<code>entity</code> archetypes','Every .ouro in the project','Script folder tree + up to three ancestor folders'],[C('.nod'),'<code>node</code> definitions','Every .ouro in the project','Like .ent; the file stem is the category']])),
    section('pf-var','.var: shared values', code(`// world.var — shared by every script in this folder
mut Damage = 5
let MaxHealth = 100`, 'world.var') + code(`// main.ouro in the same folder
mut Health = MaxHealth
Health -= Damage
Health |> Print`, 'main.ouro') + '<p>A .var file contains bindings only (no statements that do work). Its names are public: scripts in the folder read and write them as if declared at their top. Constants declared with <code>let</code> stay constant.</p>' + choose(['Several scripts in one folder share tuning values or state.','Configuration you want to edit without touching code.'], ['Only one script uses the value: declare it in that script.','The value belongs to a library: export it from a module brought in with <code>use</code>.'])),
    section('pf-ent','.ent: entity archetypes', code(`// player.ent
entity Player
    mut Health = 20
    mut Armed = true
end`, 'player.ent') + code(`// any main.ouro below this folder (or up to three levels under it)
Spawn(Player)
each P in Player
    P.Health |> Print
end`, 'main.ouro') + '<p>Each field becomes a public column named <code>Entity_Field</code> (<code>Player_Health</code>). Columns start empty; <code>Spawn</code> appends a row of the template defaults. Because .ent files are discovered across the tree, a nearby file can add entities to a program without a <code>use</code>; keep unrelated experiments in separate folders.</p>' + choose(['Many objects share one shape (players, enemies, bullets).','Several programs in a project use the same archetypes.'], ['A single object: a record or plain variables.','You need exact memory layout: a <code>struct</code> with <code>Slice(T)</code>.'])),
    section('pf-nod','.nod: node libraries', code(`// Physics.nod
node Damage in[Health i32, Amount i32] out[Health i32, Dead bool]
    Health - Amount |> Out.Health
    Health - Amount <= 0 |> Out.Dead`, 'Physics.nod') + '<p>A .nod file contains node definitions only. Its stem (<code>Physics</code>) is the category. Call a node bare when its name exists in one category; qualify it as <code>Physics.Damage</code> when several categories define it. See <a href="#nodes">nodes</a>.</p>' + choose(['A family of related nodes used across programs.','You want calls grouped by category (<code>Physics.Heal</code>, <code>Magic.Heal</code>).'], ['The logic returns one value and is used in one place: a <code>fn</code> in the script.','You need <code>return</code> or early exit: nodes have no return.'])),
    section('pf-com','.com: components', code(`// Body.com
component Health
    mut Hp = 100
    mut Armor = 2
end
component Position
    mut X = 0
    mut Y = 0
end`, 'Body.com') + code(`// World.ent
entity Hero uses Health, Position
    mut Name = "hero"
    mut Armor = 5        // replaces the component's default
end`, 'World.ent') + '<p>A component is a named group of fields with defaults. <code>entity E uses A, B</code> gives E the fields of A, then B, then its own; an own field with the same name replaces the component’s. Two used components that both define a field are an error, and so is an unknown component. Components are discovered like .ent files (and load before them); a <code>component</code> block may also sit in the .ouro itself. After that the fields are ordinary columns: <code>Hero_Hp</code>, <code>Spawn</code>, <code>each</code>.</p>'),
    section('pf-dom','.dom: domains', code(`// Vec.dom
domain Vec
    · := Dot
    × := Cross2
    ‖ := Norm1
end`, 'Vec.dom') + code(`@Vec
    mut D = U · V          // Dot(U, V)
    mut C = U × V          // Cross2(U, V)
    mut N = ‖ V            // Norm1(V)
Print(3 × 4)            // outside the block × multiplies again`, 'main.ouro') + '<p>A domain maps symbols to functions. Inside an <code>@Name</code> block, which ends at <code>end</code> or at the first line no further right than the <code>@</code>, <code>A sym B</code> calls the function with A and B, at the precedence of multiplication, and a leading <code>sym A</code> calls it with A. Any non-ASCII symbol or punctuation character can be a domain symbol; <code>×</code> and <code>÷</code> keep their arithmetic meaning in a block whose domain leaves them alone. Outside a domain block such a symbol is a syntax error. <code>ouroDomain</code> is accepted as a spelling of <code>domain</code>. Domains are notation only: the functions are ordinary functions or nodes, and the handbook’s MAST / autodiff domains are not part of this.</p>'),
    section('pf-layout','A typical project layout', code(`game/
  Body.com            // components the entities below use
  player.ent          // archetypes for every program below game/
  enemy.ent
  Physics.nod         // node library, category "Physics"
  world/
    world.var         // shared by the scripts in world/
    main.ouro         // entry point: tools/ouro_run.bat game/world/main.ouro
    systems.ouro      // pulled in with include "systems.ouro"
  lib/
    mod.ouro          // package entry for use "lib/"`, 'Layout', 'text') + '<p>A directory argument runs its <code>main.ouro</code>. Discovery means moving a file can change which entities or nodes a program sees, so keep each project in its own folder tree.</p>')
  ]);

  add('math-notation','Language guide','Math notation (@Math)','Write formulas the way a textbook does; they compile to ordinary Ouro.',[
    section('math-forms','Forms', code(`mut n = 4
mut x = 3
@Math
    mut A = 2x^2 + 3x - 1           // 2·x², juxtaposition multiplies
    mut B = 2(x + 1)y               // x(y + 1) too, unless x is a function
    mut C = |x - 5| + √x            // |…| absolute value, √ the real root
    mut D = \\frac{x + 1}{2} + x^{2}  // braces group
    mut E = Σ_{i=1}^{n} i^2         // 30; ∏_{i=1}^{n} for a product
    mut F = π · 2 + e               // constants unless a variable has the name
    mut G = 2\\theta                  // \\theta is θ (any Greek letter, \\cdot, \\sum …)
Print(A, E)`) + table(['In @Math','Means'],[['<code>2x</code>, <code>x y</code>, <code>2(x + 1)</code>','products; <code>·</code> and <code>×</code> multiply too'],['<code>{ … }</code>','grouping (outside @Math braces are floor)'],['<code>|x|</code> / <code>|z|</code> / <code>|v|</code>','absolute value / complex magnitude / vector length'],['<code>√x</code>, <code>\\sqrt{x}</code>','the real square root (a float)'],['<code>\\frac{a}{b}</code>','a / b'],['<code>Σ_{i=lo}^{hi} body</code>, <code>∏_{…}</code>','the sum / product over i = lo … hi (inclusive; empty is 0 / 1); the body is the next product term'],['<code>π</code>, <code>e</code>, <code>i</code>','constants unless a variable has that name; <code>i</code> is the imaginary unit'],['<code>∂(…)/∂x</code>, <code>∇F(W)</code>','exact derivatives at compile time (one-return functions; ∇ over an array)'],['<code>3+2i</code>, <code>conj</code>, <code>Re</code>/<code>Im</code>','complex values as <code>{Re, Im}</code> maps; Print shows <code>3+2i</code>'],['<code>u+v</code>, <code>2u</code>, <code>u·v</code>, <code>u×v</code>, <code>A×B</code>, <code>Aᵀ</code>','vector / matrix ops over ordinary number arrays'],['<code>\\name</code>','the Unicode letter or symbol (the editor completes them)'],['<code>x__1</code>','a name (subscripts are plain underscores)']]) + '<p>An <code>@Math</code> block ends at <code>end</code> or at the first line no further right than the <code>@</code>, and its statements are ordinary statements: bindings, <code>Print</code>, <code>if</code>, loops. The compiler rewrites the notation before anything runs (a Σ becomes a loop just before its statement; <code>∂</code>/<code>∇</code> become ordinary expressions), so the interpreter and native code agree. Because a sum is computed before its statement, a Σ in a <code>while</code> condition is an error; bind it inside the loop. A number followed by <code>f</code> or <code>e</code> is still a literal (<code>2f</code> is an f32), so write <code>2·f</code>.</p>'),
    section('math-diff','Derivatives', code(`mut x = 3
fn Square(V)
    return V * V
end
mut W = [1.0, 2.0, 3.0]
fn SumSq(A)
    return A[0]^2 + A[1]^2 + A[2]^2
end
@Math
    Print(∂(2x^3 + 3x)/∂x)     // 57
    Print(∂Square(x)/∂x)       // 6
    mut G = ∇SumSq(W)
    Print(G[0], G[1], G[2])    // 2.0 4.0 6.0`) + '<p>Write <code>∂(expr)/∂x</code> with parentheses around the expression; the second <code>∂</code> must name a variable. Powers need a constant exponent. A call of a function whose body is one <code>return</code> expression is inlined for the chain rule. <code>∇F(W)</code> needs a one-parameter function: if the body indexes into the parameter, you get the array of partials; if it treats the parameter as a scalar, each element of <code>W</code> is mapped through <code>F\'</code>. Outside <code>@Math</code>, <code>∂</code> and <code>∇</code> stay domain symbols.</p>'),
    section('math-complex','Complex numbers', code(`@Math
    mut Z = 3 + 2i
    mut W = 1 - i
    Print(Z + W, Z * W, conj(Z))
    Print(Re(Z), Im(Z), |Z|)
Print(Z.Re, Z.Im)`) + '<p>Inside <code>@Math</code>, <code>i</code> is the imaginary unit unless the program already has a variable named <code>i</code> (a sum index also shadows it). Arithmetic, <code>conj</code>, <code>Re</code>/<code>Im</code> and <code>|z|</code> rewrite to map field math. The value that leaves the block is a two-key map <code>{Re, Im}</code>; Print shows it as <code>3+2i</code> / <code>1-i</code>, and field access works outside the block. There is no separate complex value kind in the rest of the language.</p>'),
    section('math-tensor','Vectors and matrices', code(`mut U = [1, 2, 3]
mut V = [4, 5, 6]
mut A = [[1, 2], [3, 4]]
mut B = [[5, 6], [7, 8]]
@Math
    Print((U + V)[0], (2 * U)[1], U · V)
    Print((U × V)[0], (U × V)[1], (U × V)[2])
    mut P = A × B
    mut Q = Aᵀ
    Print(P[0][0], P[1][1], Q[0][1], |U|)`) + '<p>Arrays assigned as flat number lists are vectors; arrays of row arrays are matrices. <code>+</code> / <code>-</code> and a scalar times a vector are elementwise; <code>·</code> is the dot product; <code>×</code> is the 3-vector cross product or a matrix product on rows; <code>ᵀ</code> (or <code>\\transpose</code>) is a postfix transpose; <code>|v|</code> is the Euclidean length. These rewrite to ordinary loops and <code>Push</code> before typecheck.</p>')
  ]);

  add('io','Language guide','Console & file I/O','Interact with users and persist small data safely.',[
    section('console','Console calls', code(`Print("What is your name?")
let Name = Trim(Input())
Print("Hello, " + Name)`) + '<p><code>Print(value)</code> and <code>value |&gt; Print</code> share statement behavior. Multi-argument Print is supported. <code>Input</code> reads a line without its CR/LF; <code>InputNorm</code> trims and lowercases it. Native input buffers support multiple turns.</p>'),
    section('files','Files', table(['Call','Purpose'],[['<code>Read(path)</code> / <code>Write(path, text)</code>','Text read/write. A missing Read returns an empty string.'],['<code>ReadBin(path)</code> / <code>WriteBin(path, bytes)</code>','Latin-1 string/byte bridge.'],['<code>Append(path, text)</code>','Append text.'],['<code>Exists(path)</code> / <code>Delete(path)</code>','Probe/delete a path.'],['<code>JoinPath(a, b)</code>','Combine path strings.']]) + code(`Write("save.txt", "score=10")
let Saved = Read("save.txt")
Print(Saved)`) + '<p>Folders: <code>ListDir</code>, <code>IsDir</code>, <code>MakeDir</code> and <code>CopyFile</code> are described with the <a href="#web">website tools</a>.</p>' + note('Paths and effects','Relative paths start at the script’s folder: native runs resolve them there, and <code>run</code> starts native programs in that folder. A native executable started by hand resolves paths from wherever it was started. Writes and deletes are real filesystem effects—use a disposable project folder while learning.',true)),
    section('typed-save','Typed save and world save','<p><code>Write(path, map)</code> and <code>Read(path, Hero)</code> provide the typed-save surface, with backend restrictions. <code>SaveWorld</code> / <code>LoadWorld</code> target entity columns, using simple text formats. Neither is a production schema-versioned asset system, transaction layer, or robust arbitrary-string serialization format.</p>'),
    section('io-patterns','Small patterns', code(`// Prompt until non-empty
mut Name = ""
while Len(Name) == 0
    Print("name?")
    Name = Trim(Input())
end
Print("hi \${Name}")

// Safe read with a default
let Raw = Read("config.txt")
let Text = if Len(Raw) == 0 then "score=0" else Raw`) + '<p>Combine <code>Input</code> / <code>Read</code> with <code>Trim</code>, <code>Split</code>, and <code>Int</code> / <code>Float</code> for tiny tools. For JSON and HTTP see <a href="#web">websites &amp; HTTP</a>; for entity columns see <a href="#project-files">project files</a>.</p>' + related([['strings','Strings'],['web','Websites & HTTP'],['project-files','Project files']]))
  ]);

  add('web','Language guide','Websites & HTTP','Build static sites, serve pages, forms and JSON APIs, and call other services. Every builtin here behaves the same in the interpreter and on the C and x64 backends.',[
    section('web-ways','Two ways to make a site', table(['Approach','How','Good for'],[['Static site','A build program reads content (Markdown, JSON), fills templates and writes a folder of pages (<code>Markdown</code>, <code>RenderTemplate</code>, <code>Write</code>). Open the folder in a browser or upload it to any static host.','Docs, blogs, portfolios, anything that is the same for every visitor.'],['Server','A program listens on a port and answers each request (<code>HttpListen</code>, <code>HttpAccept</code>, <code>HttpRespond</code>).','Forms, guestbooks, JSON APIs, local tools, anything per visitor.']]) + '<p>The repository example <code>examples/web/</code> does both: <code>build.ouro</code> turns <code>pages/*.md</code> into <code>public/*.html</code> through a page template, and <code>serve.ouro</code> hosts that folder plus a guestbook (JSON storage, Markdown messages, a cookie) and a small JSON API.</p>' + code(`tools\\ouro_run.bat examples\\web\\build.ouro
tools\\ouro_run.bat examples\\web\\serve.ouro`, 'Terminal', 'shell') + '<p>Live-reload <code>serve</code> hosting is not part of the Chimera toolchain yet; run the build/server programs with <code>ouro-run</code> when they are in subset, or generate static pages and host the folder with any static file server.</p>'),
    section('web-dev','Dev hosting','<p>Chimera does not ship a live-reload dev server. Generate static output with a build program and open the folder in a browser, or run an <code>HttpListen</code> server program via <code>ouro-run</code> when that program is in the supported subset. See <a href="selfhost/">self-host</a> for dialect limits.</p>'),
    section('web-markdown','Markdown', code(`mut Page = Markdown(Read("pages/about.md"))      // your own content: raw HTML allowed
mut Note = MarkdownSafe(HttpForm(R, "message"))  // visitor text: every tag escaped`) + table(['Write','Get'],[[C('# Title  ## Part'),'<code>&lt;h1 id="title"&gt;</code>… (ids: lower-case letters and digits, spaces become <code>-</code>, repeats get <code>-1</code>, <code>-2</code>)'],[C('*em*  _em_  **strong**  ***both***  ~~gone~~'),'em, strong, del (an <code>_</code> inside a word stays literal: snake_case)'],[C('`code`   ```lang … ```'),'inline code; fenced blocks (``` or ~~~) with <code>class="language-lang"</code>'],[C('- item   1. item   - [ ] todo   - [x] done'),'lists (nested by indentation, tight or loose), task check boxes'],[C('| a | b |  |:--|--:|'),'GFM tables with left / center / right alignment'],[C('[text](url "title")  [text][ref]  ![alt](src)'),'links, reference links (<code>[ref]: url</code> lines anywhere), images'],[C('<https://x.y>   https://x.y   <me@x.y>'),'autolinks'],[C('> quote   ---   line␣␣(two spaces)'),'blockquote, rule, hard line break (or a trailing <code>\\</code>)'],[C('<div>…</div>   &copy;'),'HTML blocks and inline tags pass through (Markdown); entities stay']]) + '<p>Not supported: underlined (setext) headings, indented code blocks (use fences), footnotes and lazy blockquote lines (start each quoted line with <code>&gt;</code>).</p>' + choose(['<code>Markdown</code> for pages you or your team write.','<code>MarkdownSafe</code> for anything a visitor typed: comments, messages, profiles.'], ['The text came from a visitor: never <code>Markdown</code> (it keeps raw HTML and script links).','You need exact CommonMark corner cases: render with a dedicated tool at build time.'])),
    section('web-templates','Templates', code(`<!-- templates/post.html |=>
<article>
  <h1>{{title}}</h1>
  {{#if tags}}
  <p>{{#each tags}}<a href="/tag/{{.}}">{{.}}</a>{{#unless @last}}, {{/unless}}{{/each}}</p>
  {{/if}}
  {{{body}}}
</article>
{{> footer}}`, 'templates/post.html', 'html') + code(`mut Data = {"title": "Hello", "tags": ["ouro", "web"], "body": Markdown(Source)}
Write("public/hello.html", RenderTemplate("templates/post.html", Data))
mut Card = RenderString("<b>{{name}}</b> ({{age}})", {"name": "Ada", "age": 36})`) + table(['Tag','Meaning'],[[C('{{name}}  {{user.name}}  {{items.0}}'),'A value, HTML-escaped; missing values give "".'],[C('{{{name}}}  {{& name}}'),'A value without escaping: HTML you built yourself (Markdown output, partial pages).'],[C('{{#each xs}} … {{else}} … {{/each}}'),'Repeat for each array item (or each map value with <code>@key</code>); the else part runs when it is empty. Inside: <code>{{.}}</code> / <code>{{this}}</code>, <code>@index</code>, <code>@first</code>, <code>@last</code>.'],[C('{{#if x}} … {{else}} … {{/if}}   {{#unless x}}'),'Truthy test. Falsy: missing, "", 0, empty array or map.'],[C('{{#with user}} … {{/with}}'),'Use a map as the context: <code>{{name}}</code> means <code>user.name</code>.'],[C('{{#name}} … {{/name}}   {{^name}}'),'Mustache sections: an array repeats, a map becomes the context, a true value renders once; <code>^</code> renders when falsy.'],[C('{{> header}}'),'Insert a partial: <code>header</code>, then <code>header.html</code>, in the template’s folder.'],[C('{{! note }}'),'Comment.']]) + '<p>Names are looked up from the innermost context outward, so the page title is still visible inside <code>{{#each}}</code>. A block tag alone on its line removes the whole line, so templates can be indented freely. Ints print in decimal, floats like <code>ToJson</code>, maps and arrays as JSON (handy in <code>&lt;script&gt;</code>: <code>{{{config}}}</code>); a bool stored in a map is <code>1</code> / <code>0</code>. An unclosed block or a missing partial raises a catchable <code>Fail</code> ("template: {{#each posts}} is not closed").</p>' + choose(['A whole page or a piece of HTML longer than a few lines.','Several pages share a layout or a header: partials.','Someone who does not write Ouro edits the HTML.'], ['A short piece built in code: an interpolated string <code>"""&lt;li&gt;${HtmlEscape(Name)}&lt;/li&gt;"""</code> is simpler.','Text a visitor typed: use <code>{{name}}</code>, never <code>{{{name}}}</code>.'])),
    section('web-json','JSON', code(`mut Post = {"title": "Hi", "tags": ["a", "b"], "views": 3}
mut Text = ToJson(Post)                  // {"title":"Hi","tags":["a","b"],"views":3}
mut Back = FromJson(Text)
Back["tags"][1] |> Print              // b
JsonGet(Reply, "user.name") |> Print  // one field without decoding the rest
fn BadJson(Msg)
    Msg |> Print                      // invalid JSON at offset 12
    return {}
end
mut Data = FromJson(HttpBody(R)) |? BadJson`) + table(['JSON','In Ouro'],[['object','map (keys keep their order)'],['array of objects / arrays / strings','array of maps / arrays / strings'],['array of numbers','int array, or float array when any element has a fraction or exponent'],['other mixed array','array of strings: strings as they are, other elements as their JSON text'],['number','Int (Float when it has <code>.</code> / <code>e</code> or does not fit 64 bits)'],['true / false / null','1 / 0 / ""']]) + '<p><code>ToJson</code> writes maps, arrays, strings, numbers and bools (a top-level bool is <code>true</code>/<code>false</code>; inside a map it is already 1/0). Floats are written in a compact decimal form (<code>2.5</code>, <code>1e-07</code>); NaN and infinity as <code>null</code>, and non-ASCII text as UTF-8. <code>ToJsonPretty</code> indents by two spaces. Paths for <code>JsonGet</code> / <code>JsonHas</code> / <code>JsonType</code> / <code>JsonLen</code> are <code>a.b.0</code> or <code>a[0].b</code>.</p>' + choose(['<code>FromJson</code> when you use most of a document, or loop over it (<code>for P in FromJson(T)</code>).','<code>JsonGet</code> when you need one or two fields of a large or irregular reply.','<code>ToJsonPretty</code> for files people read; <code>ToJson</code> on the wire.'], ['The JSON comes from outside: always catch <code>FromJson</code> with <code>|?</code>.','You need to tell <code>null</code> from <code>""</code> or <code>false</code> from <code>0</code>: check with <code>JsonType(text, path)</code>.'])),
    section('web-db','Databases (SQLite)', code(`mut Db = DbOpen("site.sqlite")                 // created when missing; ":memory:" for a scratch one
if Db < 0
    Fail("database: " + DbError())
end
DbExec(Db, """
    CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT NOT NULL, views INTEGER DEFAULT 0);
    CREATE INDEX IF NOT EXISTS posts_title ON posts(title);
    """, {})
DbExec(Db, "INSERT INTO posts(title) VALUES (:title)", {"title": HttpForm(R, "title")})
mut Id = DbLastId(Db)
for P in DbQuery(Db, "SELECT id, title, views FROM posts ORDER BY id DESC LIMIT :n", {"n": 10})
    "\${P["id"]}: \${P["title"]} (\${P["views"]} views)" |> Print
end
mut Changed = DbExec(Db, "UPDATE posts SET views = views + 1 WHERE id = ?", [Id,])`) + table(['Builtin','Meaning'],[[C('DbOpen(path) / DbClose(db)'),'Open (creating the file) / close a database; -1 and <code>DbError()</code> when it cannot be opened.'],[C('DbExec(db, sql, params)'),'Run every statement in the text; the number of rows changed.'],[C('DbQuery(db, sql, params)'),'Run one statement; its rows as an array of maps (column → value).'],[C('DbLastId(db)'),'The id of the last inserted row.'],[C('DbError()'),'The last database error ("" after success).']]) + '<p>Always pass values as parameters, never by gluing them into the SQL text: <code>:name</code> / <code>@name</code> / <code>$name</code> placeholders take a map (<code>{"name": V}</code>; values of any kind can mix), and <code>?</code> placeholders take an array (<code>[A, B]</code>, one kind per array; one element needs a trailing comma: <code>[Id,]</code>). Use <code>{}</code> when there are none. Results: INTEGER → Int, REAL → Float, TEXT → Str, NULL → "", BLOB → bytes in the ReadBin form. The database works in autocommit mode (each statement is saved at once); group statements with <code>BEGIN</code> / <code>COMMIT</code> for speed or atomicity. A SQL error raises a catchable <code>Fail("SQL error: …")</code> with SQLite’s own message (the same in every engine); a busy database is retried for 5 s.</p><p>The engine is the SQLite the system already has: <code>winsqlite3.dll</code> (part of Windows 10 and later), <code>libsqlite3</code> on Linux (<code>sudo apt install libsqlite3-0</code> if missing). Nothing is bundled with your program.</p>' + choose(['Data that grows: posts, users, orders, sessions.','Several requests read and write the same data: SQLite handles the locking.','You need searching, sorting and counting: let SQL do it.'], ['A handful of settings or a small list: a JSON file (<code>ToJsonPretty</code> / <code>FromJson</code>) is simpler.','Many servers on different machines share the data: use a database server (not built in).'])),
    section('web-time','Dates and times', code(`mut T = Now()                                      // Unix seconds (UTC)
FormatTime(T, "%Y-%m-%d %H:%M") -> Print         // 2026-10-20 12:03
TimeIso(T) -> Print                              // 2026-10-20T12:03:09Z
TimeHttp(T) -> Print                             // Tue, 20 Oct 2026 12:03:09 GMT
mut Due = MakeTime(2026, 12, 24, 18, 0, 0)
mut Days = (Due - T) / 86400
mut When = ParseTime("2026-10-20T14:03:09+02:00", "%Y-%m-%dT%H:%M:%S%z")
mut Started = NowMs()
Sleep(250)
(NowMs() - Started) -> Print`) + table(['Directive','Gives','Directive','Gives'],[[C('%Y %y'),'2026  26',C('%H %I %p'),'14  02  PM'],[C('%m %d %e'),'10  20  " 5"',C('%M %S'),'03  09'],[C('%b %B'),'Oct  October',C('%j'),'day of year 001–366'],[C('%a %A'),'Tue  Tuesday',C('%u %w'),'weekday 1–7 (Mon=1) / 0–6 (Sun=0)'],[C('%z %Z'),'+0200  UTC+02:00 (UTC when 0)',C('%s'),'Unix seconds'],[C('%F %T'),'%Y-%m-%d  %H:%M:%S',C('%%'),'%']]) + '<p>Times are Ints. The calendar is computed by Ouro itself (any year, before 1970 too), so every engine prints the same text. <code>ParseTime</code> reads the same directives (<code>%z</code> accepts <code>Z</code>, <code>+02:00</code> and <code>-0700</code>; a space matches any run of spaces); text that does not match raises a catchable <code>Fail</code>. <code>MakeTime</code> rolls over out-of-range parts, so <code>MakeTime(Y, M, D + 30, 0, 0, 0)</code> is 30 days later.</p>' + choose(['Store and compare times as UTC Ints; format them when you show them.','<code>TimeIso</code> for JSON and HTML <code>&lt;time datetime&gt;</code>; <code>TimeHttp</code> for headers and cookies.'], ['You show the time to a visitor: the server’s zone (<code>FormatLocalTime</code>) is rarely theirs; send <code>TimeIso</code> and let the page format it, or label times UTC.','You measure durations: <code>NowMs</code> differences, not formatted text.'])),
    section('web-files','Files and folders', table(['Builtin','Result','Notes'],[[C('ListDir(path)'),'[Str]','Entry names (files and folders), sorted; empty when the folder is missing.'],[C('IsDir(path)'),'Bool','True for an existing folder.'],[C('MakeDir(path)'),'Bool','Creates the folder and any missing parents; true when it exists afterwards.'],[C('CopyFile(src, dst)'),'Bool','Copies bytes; false when the source is missing.'],[C('FileSize(path) / FileTime(path)'),'Int','Size in bytes / modification time (Unix seconds); -1 when missing. Rebuild only what changed: <code>FileTime(Src) &gt; FileTime(Out)</code>.'],[C('Env(name)'),'Str','An environment variable; "" when unset.'],[C('Read / Write / Append / Exists / Delete'),'—','See <a href="#io">console and file I/O</a>.'],[C('MimeType(path)'),'Str','Content type from the extension (<code>text/html; charset=utf-8</code>, <code>image/png</code>, …).']]) + '<p>Relative paths start at the script’s folder: <code>ouro-run</code> / linked executables resolve them from the working directory (usually the repo root). Strings, arrays and maps of any size can be read, built and stored (a 20 MB page is fine).</p>'),
    section('web-server','A server', code(`mut Port = if Env("PORT") == "" then 8080 else Int(Env("PORT"))
mut Server = HttpListen(Port)
if Server < 0
    Fail("port $Port is in use")
end
"Serving http://127.0.0.1:$Port/" |> Print
while true
    mut R = HttpAccept(Server)
    mut Path = HttpPath(R)
    if Path == "/hello"
        mut Name = HttpQuery(R, "name")
        HttpRespond(R, 200, "text/plain; charset=utf-8", "hello \${Name}")
    elseif Path == "/api/time"
        HttpRespond(R, 200, "application/json", ToJson({"now": TimeIso(Now())}))
    else
        HttpRespondFile(R, "public" + Path)
    end
end`) + table(['Builtin','Meaning'],[[C('HttpListen(port)'),'Listen on 127.0.0.1 (this machine only); returns a server handle, or -1 when the port is busy.'],[C('HttpListenPublic(port)'),'Listen on every network interface, so other machines can connect (see <a href="#web/web-deploy">going public</a>).'],[C('HttpListenTls(port, cert, key) / HttpListenTlsPublic'),'The same over HTTPS with PEM certificate and key files; -1 and <code>HttpError()</code> when they cannot be loaded.'],[C('HttpAccept(server)'),'Wait for the next request and read it completely; returns a request handle.'],[C('HttpMethod(r) / HttpPath(r)'),'<code>GET</code>, <code>POST</code>, <code>HEAD</code>, …; the decoded path without the query.'],[C('HttpQuery(r, key) / HttpForm(r, key)'),'A value from <code>?key=value</code> / a posted form body (decoded; "" when missing).'],[C('HttpHeader(r, name) / HttpBody(r) / HttpCookie(r, name)'),'A request header (case-insensitive) / the raw body (JSON APIs: <code>FromJson(HttpBody(R))</code>) / a cookie.'],[C('HttpSetHeader(r, name, value) / HttpSetCookie(…)'),'Add a response header / cookie before responding.'],[C('HttpRespond(r, status, type, body)'),'Send the response and close the connection. Answer every request exactly once. 204 and 304 send no body; a HEAD request gets the headers only.'],[C('HttpRespondFile(r, path) / HttpRedirect(r, url)'),'Send a file (see <a href="#web/web-static">static files</a>) / a 302 redirect.'],[C('HttpClose(server)'),'Stop listening.']]) + '<p><code>HttpAccept</code> is an event loop: while your program handles one request, the runtime keeps reading the next ones from every open connection, so many browsers can be connected at once and a slow or stalled client holds up nobody (a request that has not finished arriving after 30 s gets <code>408</code>). HTTP/1.1 connections stay open for the next request (keep-alive, closed after 15 s idle); responses are queued and sent as each connection takes them, and the rest is sent when the program ends or calls <code>HttpClose</code>. Your handler code still runs one request at a time, so keep it short. Output printed while handling a request appears immediately, so a log line per request works as a live access log; Ctrl+C stops the program.</p>' + code(`void Serve(Arg: *u8)
  while true
    mut R = HttpAccept(Server)
    HttpRespond(R, 200, "text/plain", "ok")
  end
end
void Refresh(Arg: *u8)
  while true
    Write("cache.json", HttpGet("http://127.0.0.1:9000/feed"))
    Sleep(60000)
  end
end
mut A = SpawnThread(Serve, 0)
mut B = SpawnThread(Refresh, 0)
JoinThread(A)`) + '<p>Worker threads run one at a time, but a worker that waits (<code>HttpAccept</code>, <code>HttpGet</code> / <code>HttpRequest</code>, <code>Sleep</code>) lets the others run meanwhile. So a background job (refreshing a cache, polling an API) can live next to the server, as above.</p>'),
    section('web-routing','Routes', code(`if RouteMatch("/users/:id", Path)
    mut P = RouteParams("/users/:id", Path)
    ShowUser(R, P["id"])
elseif RouteMatch("/files/*rest", Path)
    mut P = RouteParams("/files/*rest", Path)
    HttpRespondFile(R, "files/" + P["rest"])
end`) + table(['Pattern part','Matches','Captured as'],[[C('users'),'exactly that segment','—'],[C(':id'),'any one non-empty segment','<code>{"id": "42"}</code>'],[C('*rest'),'the rest of the path (also nothing); last part only','<code>{"rest": "css/site.css"}</code>'],[C('*'),'the rest of the path','—']]) + '<p>One trailing slash and anything after <code>?</code> or <code>#</code> are ignored on both sides; segments compare exactly (case-sensitive). <code>HttpPath</code> is already decoded, so captures are plain text. Check routes from the most specific to the most general. Store <code>RouteParams</code> in a variable before indexing it (indexing a call result directly is not valid syntax).</p>' + choose(['Paths carry ids or names: <code>/posts/:slug</code>, <code>/api/items/:n</code>.'], ['A fixed path: <code>Path == "/about"</code> is clearer.','Many routes share a prefix and handler: a <code>switch</code> on the first segment of <code>Split(Path, "/")</code>.'])),
    section('web-forms','Forms, cookies and redirects', code(`if Path == "/guestbook" && HttpMethod(R) == "POST"
    mut Visitor = Trim(HttpForm(R, "name"))
    Append("guestbook.txt", Visitor + "\\n")
    HttpSetCookie(R, "visitor", UrlEncode(Visitor), "Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax")
    HttpRedirect(R, "/guestbook")
elseif Path == "/guestbook"
    mut Known = UrlDecode(HttpCookie(R, "visitor"))
    …
end`) + table(['Cookie attribute','Use'],[[C('Path=/'),'Send the cookie for every page (default: the current folder only).'],[C('Max-Age=N'),'Keep it N seconds (without it the cookie ends with the browser session; <code>Max-Age=0</code> deletes it).'],[C('HttpOnly'),'Page scripts cannot read it: use for session ids.'],[C('SameSite=Lax'),'Not sent on cross-site form posts: basic CSRF protection.'],[C('Secure'),'HTTPS only (browsers still allow it on http://localhost).']]) + '<p>Answer a POST with a redirect to a page that shows the result (POST, redirect, GET): reloading the page then does not post the form again. <code>HttpRedirect</code> sends 302; for 301 / 303 / 307 use <code>HttpSetHeader(R, "Location", url)</code> and <code>HttpRespond(R, 303, "text/plain", "")</code>. Cookie values cannot contain <code>;</code>, commas or spaces: <code>UrlEncode</code> them, and <code>UrlDecode</code> what <code>HttpCookie</code> returns. Header names and values are sent without line breaks, so a visitor cannot inject extra headers.</p>' + code(`<form method="post" action="/upload" enctype="multipart/form-data">
  <input name="title"> <input type="file" name="photo"> <button>Send</button>
</form>`, 'Upload form', 'html') + code(`if Path == "/upload" && HttpMethod(R) == "POST"
    mut Data = HttpFile(R, "photo")
    if Data == ""
        HttpRespond(R, 400, "text/plain", "no file")
    else
        mut Name = "uploads/" + Str(NowMs()) + ".bin"   // never the visitor's file name
        WriteBin(Name, Data)
        HttpRespond(R, 200, "text/plain", HttpForm(R, "title") + ": " + HttpFileName(R, "photo") + ", " + Str(Len(Data)) + " bytes, " + HttpFileType(R, "photo"))
    end
end`) + '<p>Forms with <code>enctype="multipart/form-data"</code> carry files. <code>HttpFile(R, field)</code> is the file’s bytes (in the same one-character-per-byte form as <code>ReadBin</code>, so <code>WriteBin</code> saves it unchanged and <code>Len</code> is the size in bytes); <code>HttpFileName</code> and <code>HttpFileType</code> are what the browser reported. All three are "" when the field has no file. <code>HttpForm</code> reads the text fields of such forms too. The whole request is limited to 16 MB (larger ones get <code>413</code> before your program sees them); one file per field name.</p>'),
    section('web-static','Static files and caching', '<p><code>HttpRespondFile(R, "public" + Path)</code> is a complete static file server:</p><ul><li>the content type comes from the extension (<code>MimeType</code>);</li><li>a folder serves its <code>index.html</code>, so <code>/</code> and <code>/docs/</code> work;</li><li>every file is sent with <code>ETag</code> (size and modification time) and <code>Last-Modified</code>; a browser that already has it (<code>If-None-Match</code> / <code>If-Modified-Since</code>) gets <code>304 Not Modified</code> and no body;</li><li>a <code>HEAD</code> request gets the headers only;</li><li>a missing file, or a path containing <code>..</code>, gets a 404 and the call returns false (true otherwise, 304 included).</li></ul><p>Browsers revalidate such files on each visit (a cheap 304). To let them skip that for assets that never change, add <code>HttpSetHeader(R, "Cache-Control", "public, max-age=86400")</code> before the call.</p>'),
    section('web-websockets','WebSockets', code(`mut Clients = []
while true
    mut R = HttpAccept(Server)
    mut Method = HttpMethod(R)
    if Method == "WS"                       // a message from an open socket
        for C in Clients
            WsSend(C, HttpBody(R))          // chat: send it to everyone
        end
    elseif Method == "WSCLOSE"              // a socket ended
        "left: \${WsId(R)}" |> Print
    elseif HttpPath(R) == "/chat"
        mut W = WsUpgrade(R)                   // the browser asked for a WebSocket
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
ws.onopen = () => ws.send("hello");`, 'Browser side (JavaScript)', 'js') + '<p>The same <code>HttpAccept</code> loop serves pages and sockets. <code>WsUpgrade(R)</code> answers a WebSocket request (a GET with <code>Upgrade: websocket</code>) and returns the socket id, or -1 for an ordinary request, which you then answer as usual. After that, the socket’s traffic comes out of <code>HttpAccept</code> as events: <code>HttpMethod</code> is <code>"WS"</code> with the message in <code>HttpBody</code>, or <code>"WSCLOSE"</code> once when the socket ends (the browser closed it or the connection dropped, but not after your own <code>WsClose</code>). <code>WsId(R)</code> says which socket and <code>HttpPath</code> is the path it was opened on. Events need no answer; their handles are gone at the next <code>HttpAccept</code>.</p>' + table(['Builtin','Meaning'],[[C('WsUpgrade(R)'),'Accept a WebSocket request; the socket id (> 0), or -1.'],[C('WsSend(ws, text) / WsSendBytes(ws, bytes)'),'Send a text message / binary data (ReadBin form); false when the socket is closed.'],[C('WsClose(ws)'),'Close the socket (status 1000).'],[C('WsOpen(ws)'),'Is the socket still open?'],[C('WsId(R)'),'The socket of a WS / WSCLOSE event (0 for HTTP requests).']]) + '<p>Ping / pong, fragmented messages and the close handshake are handled for you; a message may be up to 16 MB, and binary messages arrive in the ReadBin form. Sockets have no idle timeout. On an <code>HttpListenTls</code> server they are <code>wss://</code> sockets.</p>' + code(`mut Ws = WsConnect("wss://chat.example.com/room")   // -1 when it fails: HttpError() says why
if Ws > 0
    WsSend(Ws, "hello")
    WsReceive(Ws) -> Print                        // waits for the next message
    while WsOpen(Ws)
        mut Msg = WsReceive(Ws)                      // "" once the socket is closed
        if Msg != ""
            Msg |> Print
        end
    end
end`, 'A client') + '<p>A program can also open a socket to a server itself. <code>WsConnect(url)</code> takes a <code>ws://</code> or <code>wss://</code> URL (certificates are checked as for <code>HttpGet</code>, with the same <code>HttpError()</code> texts plus <code>WebSocket handshake failed</code>) and returns the socket id. <code>WsReceive(ws)</code> waits for the next message and returns it (binary messages in the ReadBin form); it returns "" once the socket is closed, after which <code>WsOpen</code> is false. <code>WsSend</code>, <code>WsSendBytes</code>, <code>WsClose</code> and <code>WsOpen</code> work on these sockets too. A worker thread that waits in <code>WsReceive</code> lets the others run, so a bot can read in one thread and work in another. In the browser build the page’s own WebSocket does the work.</p>' + choose(['The page needs updates pushed from the server: chat, live dashboards, multiplayer state, notifications.','A program talks to a WebSocket service (a chat bot, a market feed, another Ouro server): <code>WsConnect</code>.'], ['The page only asks for data now and then: plain requests (<code>fetch</code> + a JSON route) are simpler.','You would send large files: use uploads and downloads.'])),
    section('web-client','Calling other servers', code(`mut Body = HttpGet("http://127.0.0.1:8080/hello?" + UrlQuery({"name": "Ada Lovelace"}))
if HttpStatus() == 200
    Body |> Print
end
mut Reply = HttpRequest("PUT", "http://api.local/items/7", ToJson({"done": 1}), {"Content-Type": "application/json", "Authorization": "Bearer " + Token})
HttpStatus() -> Print
HttpResponseHeader("Content-Type") -> Print
HttpRequest("DELETE", "http://api.local/items/7", "", {}) -> Print`) + '<p><code>HttpGet</code>, <code>HttpPost(url, body, contentType)</code> and <code>HttpRequest(method, url, body, headers)</code> return the response body; <code>HttpStatus()</code> is the status of the last call (0 when the server could not be reached) and <code>HttpResponseHeader(name)</code> reads its headers. A body is sent when it is not empty, and always for POST, PUT and PATCH. Up to five redirects are followed (303, and 301 / 302 after a POST, continue as GET without the body); chunked replies are decoded. <code>UrlQuery(map)</code> builds a query or form string.</p><p><code>https://</code> URLs use the operating system’s TLS: Schannel on Windows (updated by Windows Update) and the system OpenSSL on Linux, both loaded when first needed, so executables carry no TLS library. Certificates are checked against the system’s trusted roots and the host name. When a call fails, <code>HttpStatus()</code> is 0 and <code>HttpError()</code> says why, with the same text in every engine:</p>' + table(['HttpError()','Meaning'],[['""','The call got a response (any status).'],['could not connect','No server at that host and port (or the name does not resolve).'],['certificate not trusted','Self-signed, or issued by an authority the system does not trust.'],['certificate name mismatch','The certificate is for another host name.'],['certificate expired','The certificate is out of date.'],['TLS handshake failed','Any other TLS failure.'],['no response','Connected, but no HTTP reply came back.'],['bad URL','Not an http:// or https:// URL.']]) + '<p>For a test server with a self-signed certificate, set the environment variable <code>OURO_TLS_INSECURE=1</code>: certificate checks are then skipped. Never set it in production.</p>'),
    section('web-deploy','Ports, HTTPS and going public', code(`mut Port = if Env("PORT") == "" then 8443 else Int(Env("PORT"))
mut Server = HttpListenTls(Port, "certs/fullchain.pem", "certs/privkey.pem")
if Server < 0
    Fail("could not start: " + HttpError())   // certificate could not be loaded / could not listen
end`) + '<p>Read the port from the environment (<code>Int(Env("PORT"))</code>, as most hosts and the dev server set it) with a default for local runs. <code>HttpListen</code> accepts connections from this machine only, which is right for development and for a server behind a reverse proxy on the same machine. <code>HttpListenPublic</code> accepts them from the network: use it in containers or when the proxy runs elsewhere. Build the server with Chimera + <code>ouro-link</code> (or <code>ouro-run</code>) for a native executable.</p><p><code>HttpListenTls(port, cert, key)</code> (and <code>HttpListenTlsPublic</code>) serve HTTPS themselves: everything else (routes, keep-alive, uploads) is unchanged. The certificate and key are ordinary PEM files, as Let’s Encrypt and <code>openssl</code> write them; the certificate file may hold the whole chain. TLS comes from the operating system (Schannel on Windows, the system OpenSSL on Linux), and the handshake runs inside the event loop, so a slow client never holds up the others. Connections use TLS 1.3 where the system has it (Windows 11 and Server 2022, OpenSSL 1.1.1 and later) and TLS 1.2 otherwise. The key may be RSA or EC, as PKCS#8 (<code>BEGIN PRIVATE KEY</code>), PKCS#1 (<code>BEGIN RSA PRIVATE KEY</code>) or SEC1 (<code>BEGIN EC PRIVATE KEY</code>). On Windows it is imported into the user’s key store (CNG) under the name <code>ouroboros-tls-&lt;certificate thumbprint&gt;</code>, and intermediate certificates are taken from the Windows certificate store rather than from the PEM file.</p><p>HTTP/2 needs nothing in the program: an HTTPS server offers it to browsers (ALPN <code>h2</code>), and a plain <code>HttpListen</code> server also speaks it to clients that start with the HTTP/2 preface (h2c, as proxies such as nginx and Envoy do), next to HTTP/1.1 on the same port. Each request still comes out of <code>HttpAccept</code> one at a time with the same builtins, while many streams share one connection; headers are compressed (HPACK) and large responses follow the client’s flow-control window. Set <code>OURO_NO_HTTP2=1</code> to serve HTTP/1.1 only. WebSockets keep using HTTP/1.1 connections (browsers open a separate one for them). The Ouro HTTP client speaks HTTP/1.1.</p>' + choose(['A small public site or an internal tool that should speak HTTPS without extra software.','Local testing with a self-signed certificate (<code>openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes …</code>).'], ['You want automatic certificate renewal or several sites on one port: put Caddy or nginx in front and use <code>HttpListen</code>.'])),
    section('web-security','Safety checklist', '<ul><li>Escape everything that came from a visitor or a file: <code>{{name}}</code> in templates, <code>HtmlEscape</code> in strings, <code>MarkdownSafe</code> for formatted text. Never put visitor text in <code>{{{ }}}</code> or <code>Markdown</code>.</li><li>Catch <code>FromJson</code> and <code>ParseTime</code> on outside input with <code>|?</code> and answer 400.</li><li>Session cookies: <code>HttpOnly; SameSite=Lax</code> (and <code>Secure</code> behind HTTPS).</li><li><code>HttpRespondFile</code> refuses paths containing <code>..</code>; still build file paths from a fixed folder (<code>"public" + Path</code>).</li><li>Request bodies are capped at 16 MB and headers at 1 MB; at most 500 connections are open at once.</li><li>Uploads: never use <code>HttpFileName</code> as a path; pick the stored name yourself and check <code>HttpFileType</code> / the size before keeping a file.</li><li>Handlers run one request at a time: a slow handler (a long loop, a slow outgoing call) delays the next visitor. Keep handlers short, and move slow work to a worker thread.</li><li>HTTP/2 connections get at most 100 streams at once and the same body and header caps; a client that breaks the protocol is sent a GOAWAY and disconnected.</li><li>Keep certificate checks on (<code>OURO_TLS_INSECURE</code> is for tests only).</li><li><code>HttpListenPublic</code> exposes the server to your network: prefer <code>HttpListen</code> plus a proxy.</li></ul>'),
    section('web-limits','What is not there yet','<p>The HTTP client speaks HTTP/1.1 only (servers answer it everywhere), and WebSockets do not run over HTTP/2 connections. Handlers run one request at a time; the I/O around them is concurrent. For code that runs inside the page itself, see <a href="#browser">Ouro in the browser</a>.</p>')
  ]);

  add('browser','Language guide','Ouro in the browser','Compile a program to WebAssembly and drive a web page with it: text, HTML, form values and click handlers.',[
    section('br-build','Building for the browser', '<p>Browser / WebAssembly packaging is not in the Chimera day-to-day toolchain yet. Author programs in the subset, emit native C via Chimera, and see <a href="selfhost/">self-host</a> for current smoke coverage. A typical page still looks like:</p>' + code(`<div id="count">0</div>
<button id="plus">+1</button>
<pre id="ouro-output"></pre>
<script src="ouro.js"></script>
<script>Ouro.run("app.wasm");</script>`, 'site/index.html', 'html') + '<p>The browser build goes through the same typed IR and runtime as the native C backend, compiled for <code>wasm32</code> by LLVM: install it once (Windows: <code>winget install LLVM.LLVM</code>; Linux: <code>sudo apt install clang lld</code>; or point <code>OURO_LLVM</code> at its <code>bin</code> folder). <code>ouro.js</code> loads the program: <code>Print</code> output goes to the element with id <code>ouro-output</code> (if the page has one) and to the browser console. An <code>index.html</code> is written only when the folder has none, so your own page stays. Pages must be served over http (browsers do not load WebAssembly from <code>file://</code>); the dev server does that and reloads the page when you rebuild.</p>' + choose(['Interactive pages: calculators, games, editors, dashboards that compute in the page.','Logic you want to share between the server and the page (validation, formatting, Markdown, templates).','An offline-capable tool that keeps its data in the browser (SQLite with <code>persist</code>).'], ['The page only shows data from a server: plain HTML from templates is simpler and loads faster.','You need to listen for connections or use the engine, audio or physics: a page has none of them (see below).'])),
    section('br-dom','The page (Dom* builtins)', code(`mut Count = 0

void Add(Step)                       // a handler: one Int parameter
  outer Count
  Count += Step
  DomSetText("#count", Str(Count))
end

DomOn("#plus", "click", Add, 1)      // the 1 is passed to Add
DomOn("#ten", "click", Add, 10)
DomSetHtml("#note", Markdown("Click **+1** or **+10**."))
mut Name = DomGetValue("#name")         // an <input>'s current value`) + table(['Builtin','Meaning'],[[C('DomSetText(sel, text) / DomGetText(sel)'),'Text of the first element matching a CSS selector (set: shown as text, never as HTML).'],[C('DomSetHtml(sel, html) / DomGetHtml(sel)'),'Inner HTML (set: escape anything from a visitor first).'],[C('DomSetValue(sel, v) / DomGetValue(sel)'),'The value of an input, textarea or select.'],[C('DomSetAttr(sel, name, v) / DomGetAttr(sel, name)'),'An attribute (class, href, disabled, …).'],[C('DomOn(sel, event, Handler, N)'),'Call <code>Handler(N)</code> on each event (click, input, change, submit, keydown, …).'],[C('DomFire(sel, event)'),'Dispatch an event to the element (a synthetic click).'],[C('InBrowser()'),'True on a real page.']]) + '<p>The top level of the program runs once when the page loads (set up the page, register handlers), then each event runs its handler; globals keep their values in between. A selector that matches nothing makes setters do nothing and getters return "". Handlers are named functions with one Int parameter: pass different numbers to tell buttons apart.</p><p>Outside a page (the interpreter, native programs, Node), the same builtins work on a small simulated page with the same rules: <code>DomGet…</code> returns what was set, <code>DomSetHtml</code> also sets the text with tags removed, and <code>DomFire</code> runs the registered handlers. So a page’s logic runs and can be tested anywhere.</p>'),
    section('br-blocking','Waiting without freezing the page', code(`void Slow(Unused)
  DomSetText("#status", "Loading...")
  mut Data = HttpGet("https://api.example.com/items")   // the browser's fetch
  Sleep(500)                                         // really waits
  DomSetText("#status", "\${JsonLen(Data, "")} items")
end

DomOn("#load", "click", Slow, 0)                     // other buttons keep working meanwhile`) + '<p>A page’s script must never block, yet <code>Sleep</code>, <code>HttpGet</code> / <code>HttpRequest</code>, <code>WsReceive</code>, <code>JoinThread</code> and the job and mutex builtins wait. The build runs such programs through Binaryen’s Asyncify pass: when one of those calls waits, <code>ouro.js</code> suspends that piece of the program and resumes it once the wait is over, and the page keeps running in between. So each handler, <code>SpawnThread</code> worker and job worker is a green thread: they take turns on the page’s one thread, switching only where one waits. A handler that sleeps does not hold up the next click; <code>DomFire</code> returns once its handlers have finished.</p><p>HTTP calls go through the browser’s <code>fetch</code>: the browser follows redirects, sets <code>Host</code>, <code>Content-Length</code> and cookies itself, and the server must allow the page’s origin (CORS) unless it is the server the page came from; <code>HttpError()</code> is <code>could not connect</code> when the request does not get through. <code>WsConnect</code> uses the page’s WebSocket.</p><p>Binaryen comes from npm: the first build that needs it runs <code>npm install</code> into <code>tools/binaryen</code> (Node.js must be installed), or set <code>OURO_BINARYEN</code> to a folder with <code>wasm-opt</code>, or put it on PATH. Programs that never wait skip the pass and stay smaller.</p>'),
    section('br-db','SQLite in the page', code(`mut Db = DbOpen("notes.db")
DbExec(Db, "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, text TEXT)", {})
DbExec(Db, "INSERT INTO notes(text) VALUES (:t)", {"t": DomGetValue("#note")})
Len(DbQuery(Db, "SELECT * FROM notes", {})) -> Print`) + code(`<script>Ouro.run("app.wasm", { persist: "my-notes" });</script>`, 'index.html', 'html') + '<p>The <code>Db*</code> builtins work in the page with the same results as natively: a program that uses them gets SQLite (public domain) compiled in, downloaded once from sqlite.org into <code>tools/sqlite</code> (version and hash pinned in the build) and adding about 1 MB to the <code>.wasm</code>. A database is a file of the page’s file store, held in memory while open and written back whole when a transaction ends, so the store never holds half a transaction. <code>":memory:"</code> works as everywhere.</p><p>With <code>persist</code>, <code>ouro.js</code> keeps the page’s files, databases included, in the browser’s IndexedDB (database <code>ouro:&lt;name&gt;</code>): they are back on the next visit, and what was saved wins over the <code>files</code> option. Changes are written shortly after they happen. Each browser profile and site has its own copy, and the visitor can clear it like any site data. <code>storage: {load, put, remove}</code> plugs in another place to keep the files.</p>'),
    section('br-limits','What a page can and cannot do', table(['Works in the page','Different in the page'],[['All the language: functions, records, arrays, maps, nested data, Fail / |?','<code>Input()</code> returns "" (there is no console input).'],['JSON, Markdown / MarkdownSafe, templates, dates and times (the visitor’s time zone)','<code>Env</code> is always ""; <code>FileTime</code> is 0.'],['Sleep, threads, jobs, mutexes and atomics (green threads, see above)','A busy loop that never waits holds up the page: wait (<code>Sleep(0)</code> is enough) inside long computations.'],['HttpGet / HttpPost / HttpRequest (fetch) and the WebSocket client','The server must allow the page’s origin (CORS); no listening for connections.'],['SQLite (<code>Db*</code>), Read / Write / ListDir / MakeDir on the page’s file store (<code>files</code> seeds it, <code>persist</code> keeps it)','Without <code>persist</code>, files are gone when the page closes.'],['Print (to the page and the console)',"<code>HttpListen…</code> returns -1 (a page cannot accept connections); engine / audio / physics: the build refuses programs that need them."]]) + '<p>Programs that need a refused group get a clear error at build time.</p>')
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
    section('struct-padding','Layout, padding and SizeOf', '<p>Each field is placed at the next offset that is a multiple of its own size, and the struct is rounded up to the largest field alignment, exactly as a C compiler would. That means field order changes the size. <code>SizeOf</code>, <code>AlignOf</code> and <code>OffsetOf</code> report the real numbers, so check them instead of counting bytes by hand, especially before you hand the memory to a C library or an <code>Alloc</code>ed block.</p>' + code(`struct Mixed
    Tag: u8
    Count: i32
    Scale: f64
    Flag: u8
end

struct Packed
    Scale: f64
    Count: i32
    Tag: u8
    Flag: u8
end

Print(SizeOf(Mixed), AlignOf(Mixed))                                                  // 24  8
Print(OffsetOf(Mixed, Tag), OffsetOf(Mixed, Count), OffsetOf(Mixed, Scale), OffsetOf(Mixed, Flag))      // 0  4  8  16
Print(SizeOf(Packed), AlignOf(Packed))                                                // 16  8
Print(OffsetOf(Packed, Scale), OffsetOf(Packed, Count), OffsetOf(Packed, Tag), OffsetOf(Packed, Flag))  // 0  8  12  13`, 'Padding') + table(['Struct','Offsets (Tag, Count, Scale, Flag)','Size','Why'],[['<code>Mixed</code>','0, 4, 8, 16','24','3 bytes pad after <code>Tag</code>, 4 after <code>Count</code>, 7 after <code>Flag</code>.'],['<code>Packed</code>','Scale 0, Count 8, Tag 12, Flag 13','16','Largest field first leaves only 2 bytes of tail padding.']]) + '<p>Put the widest fields first when the struct will live in a large <code>Slice</code>: the saving is multiplied by the element count. Keep the order a C library expects when you share the type through <a href="#ffi">extern</a>.</p>' + related([['slices','Typed slices &amp; byte buffers'],['pointers','Pointers &amp; raw memory'],['ffi','C libraries (extern)']])),
    section('nested-structs','Nested structs', code(`struct Transform
    Position: Vec3
end
mut T: Transform
T.Position.X = 4.0
Print(T.Position.X)`) + '<p>Nested fields retain their lvalue identity: writes update the original container rather than a detached struct copy. Interpreter/C/x64 regressions cover nested paths through slice elements, typed pointers and Own.</p>'),
    section('struct-limits','Layout is not full ABI integration','<p>Types have explicit primitive widths, and pointers are 64-bit on the current target model. Passing/returning whole structs, typed local declarations in functions, f16 field operations, and general C-library linking remain restricted. Query layout rather than assuming every supported C struct feature exists.</p>'),
    section('struct-choose','struct, record, entity or slice?', '<p>Four constructs hold named fields. They differ in memory shape and in what the checker can promise, so pick by how many objects you have and who reads the bytes.</p>' + table(['If you need…','Use','Instead, when…'],[['One flexible named value with defaults','<code>record</code> + <code>Hero{</code>}','You need an exact byte layout or a pointer to it: <code>struct</code>.'],['Exact offsets, padding or a C-compatible layout','<code>struct</code>','The data is ordinary script data: records and maps are simpler.'],['Many objects of one shape, processed together','<code>entity</code> (columns)','You need packed rows with a stride: <code>Slice(T)</code> over a struct.'],['A packed array of fixed-layout elements','<code>Slice(Particle)</code> over <code>Alloc(SizeOf(Particle) * n)</code>','The count changes constantly and element type varies: an array.'],['A pointer to one fixed-layout value','<code>*Point</code> via <code>&amp;P</code>','You can pass the value and return the result: a plain function.']]) + code(`struct Particle
    X: i64
    V: i64
end

let Count = 4
let Raw = Alloc(SizeOf(Particle) * Count)   // room for four rows
mut Ps: Slice(Particle)
Ps = MakeSlice(Raw, Count)                  // a view of Raw, not a copy
Ps[0].X = 10
Print(Ps[0].X, SizeOf(Particle))            // 10  16
Free(Raw)`, 'Struct rows in a slice') + related([['slices','Typed slices &amp; byte buffers'],['records','Records &amp; enums'],['project-files','Project files'],['decisions','Which form should I use?']]))
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
    section('ptr-params','Passing a struct by pointer', '<p>A struct is not passed or returned by value, so a function that needs to read or update one takes a pointer. The caller writes <code>&amp;C</code> (address of <code>C</code>); inside, the parameter is declared <code>c: *Counter</code> and fields are reached with a dot. Use this to mutate a struct in place or to avoid copying a large one.</p>' + code(`struct Counter
    N: i32
end

void Bump(c: *Counter)
    c.N += 1
end

mut C: Counter
Bump(&C)
Bump(&C)
Print(C.N)                    // 2`, 'Mutating through a pointer') + '<p>The pointer is a real address. It stays valid only as long as <code>C</code> does, so do not store <code>&amp;C</code> in a longer-lived place.</p>' + related([['structs','Structs &amp; fixed layout'],['ownership','Arenas, Own &amp; Rc']])),
    section('ptr-cheatsheet','& and * patterns', table(['Pattern','Meaning','Notes'],[['<code>&amp;V</code>','Address of the variable <code>V</code>','Tested for struct variables. For scalars the interpreter may use a snapshot rather than a true alias.'],['<code>mut P: *T</code>','A pointer variable of type <code>*T</code>','Starts empty; assign <code>&amp;V</code> or a <code>BitCast</code> result.'],['<code>P.Field</code>','Field of the pointed-to struct','Dereferences automatically.'],['<code>(*P).Field</code>','The same, with the dereference spelled out','Use when the intent should be obvious to a reader.'],['<code>BitCast(*T, Raw)</code>','View a raw block as a <code>T</code>','No proof that the size, alignment or lifetime are right.'],['<code>fn F(p: *T)</code>','A parameter that receives <code>&amp;V</code>','Pass <code>&amp;V</code> at the call site.'],['<code>*dyn Trait</code>','A trait view over a pointer','See <a href="#generics-traits">Generics &amp; traits</a>.']]) + code(`struct Point
    X: i32
    Y: i32
end

mut P: Point
P.X = 1
mut Q: *Point
Q = &P
Q.X = 7                       // through the pointer, field shorthand
(*Q).Y = 9                    // explicit dereference
Print(P.X, P.Y)               // 7  9`, 'Same struct, two names') + related([['structs','Structs &amp; fixed layout'],['generics-traits','Generics &amp; traits']])),
    section('allocation','Allocation and bitcast', code(`let Raw = Alloc(SizeOf(Point))
let View = BitCast(*Point, Raw)
View.X = 42
Print(View.X)
Free(Raw)`) + '<p><code>Alloc</code> returns explicit heap storage; <code>Free</code> releases it. <code>BitCast</code> provides a typed view, not proof that size, alignment or lifetime are correct. Raw pointer-index stride behavior is not a universally completed feature; use typed slices for array traversal.</p>'),
    section('ptr-lifecycle','A heap block from Alloc to Free', '<p><code>Alloc</code> gives you raw bytes. <code>BitCast</code> lets you read and write them as a struct. <code>Free</code> gives them back. The three always belong together: allocate once, view as many times as you need, free exactly once, and never touch the view afterwards. The ownership checker follows the <code>Raw</code> name and every name derived from it, so it can report a use after <code>Free</code> or a second <code>Free</code>.</p>' + code(`struct Point
    X: i32
    Y: i32
end

let Raw = Alloc(SizeOf(Point))          // 8 bytes
let View = BitCast(*Point, Raw)         // a typed view of the same bytes
View.X = 42
View.Y = 43
Print(View.X + View.Y)                  // 85
Free(Raw)
// Print(View.X)   // checker: 'View' points to memory that was freed (through 'Raw')`, 'Alloc, view, Free') + choose(['One block with its own lifetime (a buffer, a node you build by hand).','You must hand a raw pointer to a C library.'],['Many blocks that die together: an arena (<code>ArenaNew</code>, <code>ArenaReset</code>).','One owner that should clean up automatically: <code>Own(T)</code>.','A growable list of ordinary values: an array.']) + related([['ownership','Arenas, Own &amp; Rc'],['slices','Typed slices &amp; byte buffers'],['ffi','C libraries (extern)']])),
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
    section('slice-loop','Filling and summing a slice', '<p>A slice indexes by element, not by byte: <code>Ps[I]</code> advances by <code>SizeOf(Particle)</code> and checks <code>I</code> against the length. Write loops in the usual way and use field assignment on the element. Because <code>MakeSlice</code> only wraps memory you allocated, remember to <code>Free</code> the block once, after the last use of every slice that views it.</p>' + code(`struct Particle
    X: i64
    V: i64
end

let Count = 4
let Raw = Alloc(SizeOf(Particle) * Count)
mut Ps: Slice(Particle)
Ps = MakeSlice(Raw, Count)

mut I = 0
while I < Count
    Ps[I].X = I * 10
    Ps[I].V = 1
    I += 1
end

mut Sum = 0
for mut J = 0 to 3
    Ps[J].X += Ps[J].V
    Sum += Ps[J].X
end
Print(Sum)                               // 64   (1 + 11 + 21 + 31)
Free(Raw)`, 'Loop over a slice') + related([['structs','Structs &amp; fixed layout'],['pointers','Pointers &amp; raw memory'],['control-flow','Control flow']])),
    section('subslice','SubSlice', code(`mut Window: Slice(Particle)
Window = SubSlice(Particles, 1, 3)`, 'Use before freeing Raw') + '<p><code>SubSlice(S, start, end)</code> is end-exclusive. It shares backing memory and adjusts pointer/length. It is a view, not an independent owned copy.</p>'),
    section('slice-window','Windows with SubSlice', '<p><code>SubSlice(S, start, end)</code> is end-exclusive and shares memory with <code>S</code>, so a write through the window is visible through the original. This is the tool for processing a range in place without copying: a batch of particles, one row of a grid, the visible part of a buffer.</p>' + code(`struct Particle
    X: i64
    V: i64
end

let Raw = Alloc(SizeOf(Particle) * 4)
mut Ps: Slice(Particle)
Ps = MakeSlice(Raw, 4)
mut I = 0
while I < 4
    Ps[I].X = I * 10
    I += 1
end

mut Win: Slice(Particle)
Win = SubSlice(Ps, 1, 3)                 // elements 1 and 2
Win[0].X += 5                            // writes Ps[1].X
Print(Win[0].X, Win[1].X, Ps[1].X)       // 15  20  15
Free(Raw)                                // after the last use of Ps and Win`, 'A shared window') + '<p>A window is not an owner. Free the backing block only when no slice or window over it will be read again, and do not return a window from a function that frees its block.</p>' + related([['ownership','Arenas, Own &amp; Rc'],['pointers','Pointers &amp; raw memory']])),
    section('byte-buffers','Buf', code(`let Raw = Alloc(16)
Fill(Raw, 9, 16)
mut Span: Buf
Span = MakeBuf(Raw, 16)
Print(Span[0])
Print(BufLen(Span))
Free(Raw)`) + '<p>Buf is an untyped byte span. <code>BufPtr</code> exposes its backing pointer; <code>BufSlice</code> creates an end-exclusive view. <code>Copy(dst, src, bytes)</code> copies memory; <code>Fill(dst, value, bytes)</code> fills bytes. Do not assume Copy has memmove semantics for overlapping regions.</p>'),
    section('checked-addresses','Hot-loop implementation','<p>The IR can reuse a checked slice-element address within a single call-free field assignment. It keeps the original bounds check and does not reuse across writes, calls or loop edges. This reduces redundant descriptor loads/stride calculation without switching off safety.</p>'),
    section('slice-vs-array','When to use a slice and when an array', '<p>Arrays are the everyday sequence: they grow, hold any value kind and need no allocation call. A slice is for data whose layout matters: a fixed number of fixed-size rows, processed in a hot loop or passed to native code. Start with an array and move to a slice when profiling or an interface demands it.</p>' + table(['If you need…','Use','Instead, when…'],[['A list that grows and shrinks, mixed or text values','<code>[1, 2, 3]</code> array with <code>Push</code> / <code>Pop</code>','The element is a fixed-layout struct in a hot loop: <code>Slice(T)</code>.'],['Packed rows of one struct type','<code>Slice(Particle)</code>','You need to add rows at run time: allocate a bigger block or use an array.'],['Raw bytes (files, network, pixels)','<code>Buf</code> / <code>MakeBuf</code>','Typed elements: a slice.'],['Many objects by field (structure of arrays)','<code>entity</code> columns','One object: a record or struct.'],['A range of an existing sequence','<code>Arr[a..b]</code> (arrays), <code>SubSlice</code> (slices)','You need an independent copy: build a new array.']]) + code(`// Same data, two representations.
mut Xs = [0, 10, 20, 30]               // array: grows, copies on write
Push(Xs, 40)
Print(Len(Xs))                          // 5

let Raw = Alloc(8 * 4)                  // slice: fixed, packed, no copies
mut Ys: Slice(i64)
Ys = MakeSlice(Raw, 4)
Ys[0] = 10
Print(Ys[0])                            // 10
Free(Raw)`, 'Array versus slice') + related([['collections','Arrays &amp; maps'],['structs','Structs &amp; fixed layout'],['performance','Performance &amp; measurement']]))
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
Drop(Shared)`) + '<p>Rc(T) uses explicit clone/drop reference counting. Its allocation includes a refcount header before payload. Rc is not atomic: for shared ownership across threads use <code>Arc(T)</code> (ArcNew, ArcClone, Drop), whose refcount is atomic. Do not confuse systems Rc with automatic refcounting of IR strings/arrays/maps.</p>'),
    section('own-arrows','Ownership arrows', code(`First |=> Second        // Second = First; First is moved out
Shared |+> A, B        // A = RcClone(Shared), B = RcClone(Shared)
A |->                  // Drop(A)
Mesh |=> Upload         // a node: Upload(Mesh), and Mesh is moved out`) + '<p><code>X |=&gt; Y</code> transfers X to one owner: into the variable Y (for an <code>Own(T)</code> value the source is nulled, as with <code>Y = X</code>), or into the node Y as its argument. A comma list after <code>|=&gt;</code> is an error; share with <code>|+&gt;</code>, which makes each name on its right another holder of the <code>Rc(T)</code> value on its left. <code>X ||&gt;</code> drops X now. Borrowing is the default and has no arrow: passing a value to a function or reading it never moves it. After <code>|=&gt;</code> or <code>||&gt;</code>, using X before giving it a new value is a checker error.</p>'),
    section('ownership-check','What the checker enforces', table(['Rule','Error'],[['Everything that points at an allocation — another name (<code>mut Q = P</code>, <code>P + 4</code>, <code>MakeBuf(P, n)</code>) or an element or field holding it (<code>Arr[0] = P</code>, <code>Push(Arr, P)</code>) — dies when it is freed, dropped or its arena is reset','<code>\'Q\' points to memory that was freed at line 5 (through \'P\')</code>, <code>\'Slots[0]\' holds a pointer that was freed at line 11</code>'],['A value moved out (<code>X |=&gt; Y</code>, <code>Y = X</code> for an <code>Own(T)</code>) or dropped (<code>X ||&gt;</code>, <code>Drop(X)</code>) is not used until it gets a new value','<code>\'X\' is used after it was moved out (line 7)</code>'],['A call does what its function does to the pointers it is given (including every <code>impl</code> of a trait method, and nested container paths such as <code>Rows[0][0]</code>); a function that frees or drops a parameter, resets its arena, moves it out, keeps it in a top-level variable or container, or frees a top-level pointer, has that effect at every call; an FFI callback that Free/Drop/moves Own is rejected','<code>\'A\' is used after \'Release\' freed it (line 24)</code>, <code>\'Rows[0.0]\' holds a pointer that was freed</code>'],['<code>Free</code> / <code>Drop</code> once per value','<code>\'P\' is released twice (already freed at line 20)</code>'],['A pointer from <code>ArenaAlloc(A, n)</code> dies with <code>ArenaReset(A)</code> / <code>ArenaDestroy(A)</code>; a destroyed arena is not used again','<code>\'Block\' points into arena \'Arena\', which was reset at line 25</code>'],['A function that runs on another thread (SpawnThread, JobSubmit, JobSpawn*, <code>||&gt;&gt;</code>) writes a top-level variable only between <code>MutexLock</code> and <code>MutexUnlock</code>, directly or through the functions it calls, unless it is an <code>AtomicI64</code>; a <code>||&gt;&gt;</code> node may write its own entity\'s fields','<code>\'Count\' is written by \'Work\' through \'Helper\', which runs on another thread</code>'],['A variable a worker reads outside a Mutex is not written meanwhile: by another worker, or by the main program between the spawn and its JoinThread / JobWait; the main program in that window reads or writes, under a Mutex, what a worker writes','<code>\'Ready\' is read by \'Watch\' on another thread while the main program writes it (line 39)</code>'],['A <code>||&gt;&gt;</code> node does not read another entity\'s copy of a field it writes (<code>Mob_Hp[S + 1]</code>)','<code>\'Mob_Hp[…]\' reads another entity\'s field while this \'||&gt;&gt;\' node writes it</code>']]) + '<p>Moves and releases are followed through each function body and the top level in order. A branch that might move a value counts as moving it, and a loop body is checked as if it ran twice, so a <code>Free</code> inside a loop without a new <code>Alloc</code> is a double free. Passing a value to a function or reading it never moves it.</p>'),
    section('ownership-limits','What is not guaranteed', note('Not a full borrow checker','Calls are followed through what each function does to its parameters, its result and top-level variables (a function that releases something on only one branch counts as releasing it). Trait method names merge every <code>impl</code> summary; nested array/field paths are tracked; an FFI callback that Free/Drop/moves Own is rejected at the call site. Worker bodies are still matched on spawns at the top level. The runtime still catches use of a moved Own and arena affinity errors.',true))
  ]);

  add('ffi','Systems programming','C libraries (extern)','Declare C functions from a shared library and call them like Ouro functions.',[
    section('ffi-declare','Declaring', code(`extern "user32.dll"
    fn MessageBoxA(Hwnd: *u8, Text: CStr, Title: CStr, Flags: u32) -> i32
end
extern "msvcrt.dll", "libc.so.6"
    fn strlen(S: CStr) -> u64
    fn abs(X: i32) -> i32 as CAbs     // abs is also a builtin: call it CAbs
end
MessageBoxA(0, "Saved", "Ouro", 0)
Print(strlen("héllo"), CAbs(-4))      // 6 4`) + '<p>An <code>extern</code> block names one or more libraries; the first that opens is used (<code>LoadLibrary</code> on Windows, <code>dlopen</code> elsewhere), so <code>"msvcrt.dll", "libc.so.6"</code> runs on both. Each line declares one C function with its C types; <code>as Name</code> gives it another Ouro name, needed when the C name matches a builtin or a function. The library loads on the first call, and a missing library or function stops the program with <code>extern: cannot load …</code> / <code>extern: \'f\' is not in …</code>. Calls use the platform’s C calling convention.</p>'),
    section('ffi-callbacks','Callbacks and variadic functions', code(`extern "msvcrt.dll", "libc.so.6"
    fn qsort(Base: *u8, N: u64, Size: u64, Cmp: fn(*u8, *u8) -> i32)
    fn sprintf(Out: *u8, Fmt: CStr, ...) -> i32
end
struct Num
    V: i32
end
fn ByValue(A: *Num, B: *Num)
    return A.V - B.V
end
qsort(Raw, 5, SizeOf(Num), ByValue)      // Raw from Alloc, filled through a Slice(Num)
mut Buf = Alloc(64)
sprintf(Buf, "%s=%lld (%.2f)", "count", 42, 2.5)
Print(ReadCStr(Buf))                      // count=42 (2.50)`) + '<p>A parameter declared <code>fn(T, …) -&gt; T</code> takes an Ouro function by name; C calls it with C values, converted like extern results (a pointer into Ouro memory reads as the Ouro pointer, so <code>A.V</code> works in the interpreter too). The callback runs on the thread that called C, and its parameters take those types (annotate pointer ones, <code>A: *Num</code>). The ownership checker rejects a callback whose summary Free/Drop/moves Own. After the fixed parameters, <code>...</code> takes any number of extra arguments: a whole number passes as <code>long long</code> (use <code>%lld</code>), a float as <code>double</code>, a string as <code>const char *</code>. <code>ReadCStr(P)</code> reads the NUL-terminated text C left at a pointer.</p>'),
    section('ffi-types','Types', table(['C type','Ouro argument','Notes'],[['<code>i8 … i64</code>, <code>u8 … u64</code>','a whole number','Must fit, as with <code>u8(X)</code>: <code>300</code> for a <code>u8</code> is an error, never a wrap. A <code>u64</code> result above the i64 range comes back negative.'],['<code>f32</code> / <code>f64</code>','a number','An f32 result prints with f32 digits.'],['<code>bool</code>','a bool or number','A C <code>int</code>: non-zero is true.'],['<code>CStr</code>','a string','UTF-8 with a terminating NUL, valid during the call; a returned <code>CStr</code> is copied (NULL is <code>""</code>).'],['<code>*T</code>','a pointer, or 0 for NULL','An address. Memory from <code>Alloc</code> / <code>Buf</code> can be filled by C (an out-parameter); a pointer C returns can be passed back to C.']]) + '<p>The checker reports a wrong argument count or kind. In the interpreter the call goes through <code>ctypes</code>, and an interpreter pointer gives C the address of its bytes, so writes are visible to Ouro. The browser build has no shared libraries.</p>')
  ]);

  add('generics-traits','Systems programming','Generics & traits','Specialize code at bind time or dispatch through a vtable.',[
    section('generics','Monomorphization', code(`struct Pair[T]
    First: T
    Second: T
end
fn Id[T](v: T)
    return v
end
mut P: Pair[i32]
P.First = 3
P.Second = 4
Print(SizeOf(Pair(i32)))     // 8
Print(Id(i32)(7))            // 7`) + '<p>Declare a generic with its type parameter in brackets (<code>struct Pair[T]</code>, <code>fn Id[T](v: T)</code>) and annotate with a concrete argument (<code>mut P: Pair[i32]</code>). In an expression the instance is named with parentheses: <code>Pair(i32)</code>, <code>Id(i32)(7)</code>. Preparation specializes each concrete instance, for example Pair_i32. This is compile-time monomorphization rather than runtime type reflection or a template constraint system.</p>'),
    section('gen-pair','Pair[T]: one definition, several layouts', '<p>A generic struct is declared once with a type parameter in brackets and used with a concrete type. Each distinct argument creates its own specialised struct at preparation time, with the layout that type implies. <code>Pair[i32]</code> is 8 bytes and <code>Pair[f64]</code> is 16; there is no shared "boxed" representation.</p>' + code(`struct Pair[T]
    First: T
    Second: T
end

mut A: Pair[i32]
mut B: Pair[f64]
A.First = 1
A.Second = 2
B.First = 1.5
B.Second = 2.5
Print(SizeOf(Pair(i32)), SizeOf(Pair(f64)))    // 8  16
Print(A.First, B.Second)                        // 1  2.5`, 'Two instances') + '<p>Declarations and annotations use brackets (<code>struct Pair[T]</code>, <code>mut A: Pair[i32]</code>). In an expression such as <code>SizeOf(…)</code>, the instance is named by applying the type in parentheses: <code>Pair(i32)</code>.</p>' + related([['structs','Structs &amp; fixed layout'],['types','Values &amp; type checking']])),
    section('gen-id','Id[T] and explicit type arguments', '<p>A generic function is declared as <code>fn Id[T](v: T)</code>. The type argument is given at the call, in its own parenthesis group: <code>Id(i32)(7)</code>. The compiler does not infer <code>T</code> from the value, so a plain <code>Id(7)</code> is "unknown function". That is the cost of compile-time specialisation: every instance is a separate, fully typed function you can reason about.</p>' + code(`fn Id[T](v: T)
    return v
end

Print(Id(i32)(7), Id(f64)(2.5))    // 7  2.5
// Print(Id(7))                    // error: unknown function 'Id'`, 'Explicit instances') + choose(['One algorithm over several fixed-layout types (a swap, a pair, a typed slice helper).','You want each instance checked and specialised, with no run-time dispatch.'],['The set of types is open at run time: a trait with <code>AsDyn</code>.','Script code that works on any value: ordinary untyped functions already do.']) + related([['functions','Functions &amp; calls'],['slices','Typed slices &amp; byte buffers']])),
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
    section('trait-dispatch','One trait, several implementations', '<p>A trait names the methods a type must offer. Each type gets an <code>impl</code>. A dynamic view, <code>*dyn Shape</code>, built with <code>AsDyn(Shape, &amp;Value)</code>, lets one variable refer to any implementor, and a call looks up the right method at run time. Reach for it when different struct types must be handled through one interface, such as a list of drawable or updatable things.</p>' + code(`trait Shape
    fn Area(Self)
end

struct Square
    Side: i32
end
struct Rect
    W: i32
    H: i32
end

impl Square: Shape
    fn Area(Self)
        return Self.Side * Self.Side
    end
end
impl Rect: Shape
    fn Area(Self)
        return Self.W * Self.H
    end
end

mut S: Square
S.Side = 3
mut R: Rect
R.W = 2
R.H = 5

mut A: *dyn Shape
mut B: *dyn Shape
A = AsDyn(Shape, &S)
B = AsDyn(Shape, &R)
Print(Area(A), Area(B))               // 9  10`, 'trait, impl, AsDyn') + '<p>The trait view borrows: <code>S</code> and <code>R</code> must outlive <code>A</code> and <code>B</code>, and creating a view moves nothing. The ownership checker merges the effect of every <code>impl</code> of a method, so if one implementation frees an argument, a call through the trait is treated as freeing it.</p>' + related([['ownership','Arenas, Own &amp; Rc'],['pointers','Pointers &amp; raw memory']])),
    section('trait-limits','Restrictions','<p>Trait implementations must lower to compatible signatures. Whole systems values and assignments to trait method parameters can be restricted. There is no documented blanket-impl, associated-type, async-trait or trait-based lifetime guarantee. Use the tested explicit struct + trait + AsDyn pattern.</p>'),
    section('trait-vs-generic','Generic or trait?', '<p>Both remove duplication. The difference is when the choice is made. A generic function is specialised at compile time for each type argument: fast, no indirection, one type per instance. A trait object chooses the implementation at run time through a vtable: one variable can hold different types, at the cost of an indirect call.</p>' + table(['','Generic (<code>Id[T]</code>, <code>Pair[T]</code>)','Trait (<code>trait</code> / <code>impl</code> / <code>AsDyn</code>)'],[['Chosen','At compile time, per type argument','At run time, per call'],['One variable holds','One concrete type','Any implementor'],['Call syntax','<code>Id(i32)(7)</code>','<code>Area(A)</code> on a <code>*dyn Shape</code>'],['Cost','A specialised copy of the code for each instance','One indirect call per method'],['Use it for','Containers and algorithms over fixed-layout types','Heterogeneous collections and plug-in behaviour']]) + '<p>You can combine them: a generic helper that takes a <code>*dyn Trait</code> is just a function over the view. If you only ever have one implementor, you do not need a trait.</p>' + related([['structs','Structs &amp; fixed layout'],['decisions','Which form should I use?']]))
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
    section('atomics','Atomics and mutexes', '<p>AtomicI64 is accessed with <code>AtomicLoad</code>, <code>AtomicStore</code>, <code>AtomicAdd</code> and <code>AtomicCas</code>. Native AtomicAdd returns the new value; CAS returns the previous value. The platform layer uses sequentially consistent operations. MutexNew/Lock/Unlock/Destroy provide explicit exclusion.</p><p><code>Arc(T)</code> is Rc with an atomic refcount: <code>ArcNew(T)</code>, <code>ArcClone(A)</code> and <code>Drop(A)</code> are race-safe from any thread (the payload still needs AtomicI64 or a Mutex). <code>MutexMapNew()</code> returns a handle to a string-keyed map with its own lock: <code>MutexMapSet(M, key, v)</code>, <code>MutexMapGet(M, key, default)</code>, <code>MutexMapLen(M)</code>, <code>MutexMapDestroy(M)</code>; threads can write keys without an external Mutex. Native builds store whole-number values only; the interpreter stores any value.</p>'),
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
    section('thread-safety','When workers share the heap', note('Lock by default; atomics while parallel jobs run','Ordinary SpawnThread / JobSubmit workers still take turns under a runtime-wide mutex (released while a worker blocks in HttpAccept, an HTTP call or Sleep). While parallel <code>||&gt;&gt;</code> / <code>|&gt; from</code> jobs are active, retain/release use atomics and Print is locked, so a heap-safe or number-only body can skip that mutex and use every core. Mutating a shared string/array from several workers without partitioning, and race-safe systems <code>Rc</code>, are still not a free-for-all — keep shared mutation under Mutex / AtomicI64 or in number-only entity columns.',true))
  ]);


  add('assembly','Tooling & internals','Inline assembly','x64 MASM snippets that reach Ouro variables by name.',[
    section('asm-block','ASM blocks', code(`mut N = 10
@ASM
{
    mov rax, {N}
    add rax, 5
    mov {N}, rax
}
N |> Print`, 'Prints 15') + '<p>An <code>@ASM { … }</code> block is x64 MASM placed where the block appears, at the top level or inside a function. <code>{Name}</code> is the memory operand of that variable: a global, a parameter or a local. It always names a qword in memory (for a struct, its first qword), never a register, and the value written there is what Ouro reads next. A name the checker does not know is an error at the <code>@ASM</code> line, with a spelling suggestion.</p>'),
    section('asm-data','Data and calls', code(`@ASM
{
.data
    _k dq 27
.code
    mov rax, qword ptr [_k]
    add {N}, rax
}`) + '<p>A snippet may switch to <code>.data</code> for constants and must return to <code>.code</code>. <code>extrn</code> declarations are allowed. At a snippet rsp is 16-byte aligned with 32 bytes of shadow space, so a Win64 call can be made directly.</p><p>A file that contains nothing but one @ASM block is a complete MASM program instead: it defines its own <code>main proc</code>, and the x64 build assembles it as written and links it against kernel32 with <code>main</code> as the entry point. <code>{Name}</code> has no meaning there. Write console output with <code>WriteFile</code> rather than <code>WriteConsoleA</code> if the program may run with redirected output.</p>'),
    section('asm-contract','The register contract', table(['Rule','Why'],[['Preserve rbx, rbp, rdi, rsi, rsp, r12–r15 and xmm6–xmm15','The register allocator keeps Ouro values in callee-saved registers across a snippet.'],['rax, rcx, rdx, r8–r11 and xmm0–xmm5 are free','A snippet counts as a call; nothing caller-saved is live across it.'],['Copy by-ref parameters and entity elements into a local first','<code>{Name}</code> must name storage; by-ref parameters are rejected.'],['Do not jump out of a snippet','Control flow must fall through to the next statement.']]) + code(`each Player
    mut H = Health
    @ASM
    {
        add {H}, 5
    }
    mut Health = H
end`, 'Working on an entity element')),
    section('asm-backends','Backends and errors','<p>@ASM needs the x64 backend. <code>--backend auto</code> picks x64 for a program with an @ASM block, <code>--backend c</code> reports “@ASM block needs --backend x64”. The interpreter skips @ASM blocks, so these programs are compared against their expected output on x64 only.</p><p>Each snippet is preceded by a <code>; ouro src L&lt;n&gt;</code> marker. An ml64 error inside a snippet is reported as <code>error: N:1: (ml64 L…)</code> at the @ASM line, and an unresolved symbol at link time as <code>error: N:1: (link): …</code>.</p>' + note('Not portable code','Snippets are Win64 MASM. Keep them small and test them on x64; runtime internals (heap layout, ouro_rt_* symbols) are not a stable interface.',true))
  ]);

  add('backends','Tooling & internals','Compiler & backends','Chimera emits C; ouro-link builds a native executable.',[
    section('pipeline','The compilation pipeline','<p>Chimera parses the frozen subset, expands <code>use</code>/<code>include</code>, and emits a single C translation unit that calls the portable Ouro runtime. <code>ouro-link</code> compiles that C with the discovered toolchain (MSVC or hosted) and links the runtime objects. Day-to-day: <code>ouro-run</code> wraps emit + link + execute.</p>'),
    section('backend-selection','What Chimera produces', table(['Step','Output','Notes'],[['Chimera','<code>.c</code> with <code>ouro_program</code>','<code>-o</code> path; optional <code>--dump-ast</code>'],['ouro-link','native executable','Freestanding MSVC or hosted gcc/clang'],['ouro-run','run result','Emit + link + exec in one step']]) + code('build\\chimera.exe main.ouro -o build\\main.c\ntools\\ouro_link.bat build\\main.c -o build\\main.exe --out-dir build','Terminal','shell') + '<p>Win64 MASM / <code>@ASM</code> and packaged <code>--wasm</code> browser builds are outside the Chimera freeze; see the <a href="selfhost/">self-host handbook</a> for what the subset accepts today.</p>'),
    section('runtime-layout','Runtime','<p>Generated programs use the portable refcounted runtime (strings, arrays, maps) plus the systems allocation builtins when you call them. Chimera programs are freestanding on Windows MSVC (<code>ouro_entry</code>) or hosted elsewhere.</p>'),
    section('abi','Native link','<p><code>ouro-link</code> discovers <code>cl</code>/<code>link</code> (or gcc/clang), compiles runtime sources once per out-dir cache, and links your program. Override with <code>OURO_CC</code> / <code>OURO_LIBPATH</code> when needed.</p>')
  ]);

  add('cli','Tooling & internals','Command-line reference','Chimera, ouro-link, ouro-run, and Makefile helpers.',[
    section('commands','Commands', table(['Command','Purpose'],[['<code>build/chimera file.ouro [-o out.c] [--dump-ast]</code>','Emit C for the Chimera subset.'],['<code>tools/ouro_link[.bat|.sh] file.c [-o exe] [--out-dir dir]</code>','Compile and link with the runtime.'],['<code>tools/ouro_run[.bat|.sh] file.ouro</code>','Emit, link, and execute.'],['<code>make tools-bootstrap</code>','Build native <code>ouro-link</code> / drivers.'],['<code>make link C=… [OUT=…]</code>','Link a <code>.c</code> via the wrapper.'],['<code>make ouro-run PROG=…</code>','Run a program through the wrapper.'],['<code>build/ouro-run-cases</code> / <code>ouro-fail-cases</code>','Frozen fixture gates.']])),
    section('flags','Chimera options','<p><code>-o path</code> selects the C output (default: input path with <code>.c</code>). <code>--dump-ast</code> prints parse tags for debugging. There is no separate check/run subcommand: rejection is on emit; execution is <code>ouro-run</code> or the linked binary.</p>'),
    section('run-behaviour','How ouro-run behaves','<p><code>ouro-run</code> writes C under <code>build/</code>, links with <code>ouro-link</code>, and starts the executable in the repository root working directory. Output appears on your terminal; a nonzero link or program status fails the wrapper.</p>'),
    section('artifacts','Outputs','<p>Chimera writes the requested <code>.c</code>. <code>ouro-link</code> places objects and the executable under <code>--out-dir</code> (often <code>build/</code>). Runtime object caches live beside that out-dir.</p>'),
    section('regressions','Fixture gates', code(`build\\ouro-run-cases.exe
build\\ouro-fail-cases.exe
make tools-bootstrap`, 'Terminal','shell') + '<p>These native drivers exercise <code>compiler/cases.txt</code>, <code>cases_ouro_only.txt</code>, and <code>fail_cases.txt</code> against <code>.expect</code> / reject rules. Full-language host harnesses are not the day-to-day path.</p>')
  ]);

  add('editor','Tooling & internals','Editor & diagnostics','Editors and Chimera diagnostics.',[
    section('vscode','VS Code integration','<p>The repository ships a local extension under <code>editors/vscode</code> for <code>.ouro</code> grammar. Point the LSP client at the hybrid server when configured for Chimera diagnostics (<code>tools/ouro_lsp_hybrid</code> / seed docs). This is source in the tree, not a marketplace promise.</p>' + code(`code --install-extension editors/vscode`, 'Terminal', 'shell')),
    section('lsp','Language server features', table(['Capability','Notes'],[['Diagnostics','Chimera emit errors when the hybrid server is wired'],['Grammar','Graph edges, match, modules'],['Completion','Keywords and builtins (editor)']]) + '<p>Prefer compiling with Chimera while editing subset programs. Full refactor / debug-adapter suites are out of scope.</p>'),
    section('error-locations','Reading errors','<p>Chimera prints <code>error:</code> messages on failed emit. Fixture gates surface <code>FAIL emit</code> / <code>FAIL link</code> / <code>FAIL run</code>. Use <code>--dump-ast</code> when the question is parse shape.</p>' + related([['errors','Errors & Fail'],['cli','Command-line reference'],['backends','Compiler & backends']]))
  ]);

  add('performance','Tooling & internals','Performance & measurement','Native compilation is a starting point, not a C-speed guarantee.',[
    section('perf-guidelines','Choose data representation deliberately', pick([['Hot contiguous numbers','<code>struct</code> + <code>Slice(T)</code>','Open arrays/maps of boxed values'],['One-shot tools / config','arrays, maps, records','Forced C layout'],['Per-entity columns','entity templates + <code>each</code>','Ad-hoc maps keyed by string every frame'],['Parallel over a group','<code>Group ||&gt;&gt; F</code> (heap-safe)','Spawning threads by hand']]) + '<p>Allocate outside inner loops. Prefer field arithmetic the checker can see. Arrays/maps are convenient and pay tagging / ownership / helper costs.</p>'),
    section('perf-parallel','Parallel edges', code(`// Number-only or heap-safe body: uses worker threads while jobs run.
Group ||>> UpdateBody
Nums |> Add from 0`) + '<p><code>||&gt;&gt;</code> and folds can use every core when the body is heap-safe (atomic refcounts while jobs run). Mutating shared non-atomic state inside a parallel body is undefined. See <a href="#pipes">edges</a> and <a href="#concurrency">concurrency</a>.</p>'),
    section('perf-measure','Measure native runs','<p>Time linked executables directly (shell <code>Measure-Command</code>, <code>time</code>, or your profiler). Compare programs built with Chimera + <code>ouro-link</code> under the same out-dir and flags. Host-only perf runners are not part of the day-to-day toolchain.</p>'),
    section('perf-results','Recorded development measurements', table(['Workload','C backend / optimized C time','x64 / optimized C time'],[['Scalar state updates','0.98×','0.95×'],['Contiguous particles','1.43×','2.33×'],['Float transforms','1.13×','1.91×'],['Job graph/wrapper','1.62×','1.76×']]) + '<p>Five-run medians on Windows/MSVC 19.44. Lower is better; small scalar gaps can be noise. Not a portable guarantee.</p>'),
    section('perf-next','What to profile next','<p>Longer kernels, vectorization, hoistable bounds checks, allocation pressure, ECS churn, strings, and safe parallel jobs. JSON under <code>build/engine_perf/</code> and <code>ENGINE_FOUNDATION.md</code> record caveats. Do not advertise universal C parity from these numbers.</p>')
  ]);

  add('recipes','Reference','Worked examples','Small complete patterns you can adapt and test.',[
    section('recipe-counter','A reusable counter', code(`void Increment(N)
    N += 1
end
mut Count = 0
for mut I = 1 to 3
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
Print(EngineLength3(3.0, 4.0, 0.0))`, 'main.ouro in docs/ · expected output: 3.0, then 5.0') + '<p>Run with <code>tools/ouro_run.bat</code> (or <code>.sh</code>) when the sample is in the Chimera subset. The sample provides scalar math, not a production Vec/Mat/Quat package. EngineRoot uses a fixed Newton iteration count for modest positive values.</p>'),
    section('recipe-website','A website: generator plus server', code(`tools\\ouro_run.bat examples\\web\\build.ouro
tools\\ouro_run.bat examples\\web\\serve.ouro`, 'Terminal', 'shell') + '<p><code>examples/web/</code> is a complete small site: <code>layout.ouro</code> holds the shared HTML template and navigation, <code>build.ouro</code> converts a Markdown subset (headings, lists, code blocks, paragraphs) into pages, and <code>serve.ouro</code> serves the pages and a guestbook form that stores messages in a file and redirects after each post. See <a href="#web">websites and HTTP</a>.</p>'),
    section('recipe-graph','Graph dialect pipeline', code(`fn Double(X)
    return X * 2
end
fn Add(Acc, X)
    return Acc + X
end
mut Nums = [1, 2, 3, 4]
Nums ||> Double |> Print
let Total = Nums |> Add from 0
Print(Total)
3, 9 |> Max |> Print`, 'Edges · expected: [2, 4, 6, 8], then 10, then 9') + '<p>See <a href="#pipes">edges &amp; flows</a> and <code>tests/bug/cases/graph_dialect.ouro</code>.</p>'),
    section('recipe-match','Match router', code(`fn Rank(Score)
    return Score | match
        It >= 90 -> "S"
        It >= 70 -> "A"
        _ -> "C"
    end
end
Print(Rank(95))
Print(Rank(40))`, 'Match · expected: S, then C')),
    section('recipe-testing','Find larger working projects','<p>Explore <code>examples/game</code> for UI, audio, physics and Vulkan scenes; <code>examples/systems</code> for ownership, traits and jobs; <code>tests/bug/cases</code> for narrow reproducible behavior (including <code>graph_dialect</code>). Compile with an explicit backend and read the matching <code>.expect</code> fixtures before assuming support.</p>')
  ]);

  add('api','Reference','Builtin API index','A searchable inventory derived from the current compiler catalogs.',[
    section('api-reading','How to read the reference','<p>Each entry names its family, known argument/return information, and implementation-level caveats. Engine signatures come from ABI tables; some have custom overloads or named out arguments. Gradual checker return types are inference hints, not proof of all runtime behaviors.</p>' + note('Inventory is not universal coverage','A callable name does not mean every backend implements every argument combination. Engine wrappers are not general FFI. PhysX/Flow/Blast can be stubs or software fallbacks. Read the linked guide before relying on a family.')),
    '<input id="api-filter" class="api-filter" type="search" aria-label="Filter builtin reference" placeholder="Filter by name, family, or behavior…"><p id="api-count" class="api-count"></p><div id="api-list"></div>'
  ]);

  add('syntax-reference','Reference','Syntax quick reference','A compact map of declarations, expressions, blocks, and keywords.',[
    section('syntax-table','Core forms', table(['Construct','Syntax'],[['Mutable / immutable','<code>mut X = expr</code> / <code>let X = expr</code>'],['Typed storage','<code>mut X: Type</code>'],['Assignment / compound','<code>X = expr</code> / <code>X += expr</code>'],['Block / procedure / return','<code>if (…) … end</code> / <code>void F(…) … end</code> / <code>return expr</code>'],['Value function','<code>fn F(…) … end</code>'],['Counted / iterable loop','<code>for mut I = A to B by Step … end</code> / <code>for X in A … end</code>'],['Switch','<code>switch X case A, B … else … end</code>'],['Record / struct / entity','<code>record R … end</code> / <code>struct S … end</code> / <code>entity E … end</code>'],['Enum','<code>enum E … end</code>'],['Phase block','<code>on Tick … end</code> (one per phase)'],['Typed binding','<code>mut speed: i32 = 5</code> / <code>let limit: i64 = 100</code>'],['Write a top-level name from a function','<code>outer Score</code> (first line of the body)'],['Step','<code>count++</code> / <code>count--</code>'],['Range / range slice','<code>a..b</code> / <code>S[a..b]</code> (inclusive)'],['Flow / fan-in / fold','<code>x |&gt; F |&gt; G</code> / <code>a, b |&gt; F</code> / <code>xs |&gt; F from 0</code>'],['Guard / match / loop','<code>x | when c |&gt; F</code> / <code>x | match … end |&gt; F</code> / <code>while c … end</code>'],['Iterate / filter / guard','<code>xs ||&gt; F</code> / <code>xs ||&gt; F when It &gt; 0</code>'],['Match chain','<code>x | match It == 1 -&gt; "one" | _ -&gt; "other" end |&gt; F</code>'],['Store / catch / reactive','<code>x |&gt; Var</code> / <code>f |? Handler</code> / <code>Q |! chain</code>'],['Node','<code>node N in[A: i32] out[R] … end</code>'],['Interpolation / multi-line text','<code>"$Name ${Len(X)}"</code> / <code>"""…"""</code>'],['Fail','<code>Fail("msg")</code> / <code>x | when c |&gt; Fail("msg")</code>'],['Trait / impl','<code>trait T … end</code> / <code>impl S: T … end</code>'],['Pointer / address / deref','<code>*T</code> / <code>&amp;V</code> / <code>(*P).Field</code>'],['Generic application','<code>Pair[i32]</code> / <code>fn Id[T](x: T)</code>'],['Import / include / export','<code>use "path"</code> / <code>include "path"</code> / <code>export A, B</code>'],['Array / singleton / map','<code>[a,b]</code> / <code>[a,]</code> / <code>{ key: value }</code>'],['Entity iteration','<code>each P in Player where condition … end</code>'],['Inline assembly (x64)','<code>@ASM … end</code>']])) ,
    section('keyword-list','Keywords','<p>if · elseif · else · end · void · while · for · to · in · entity · record · struct · enum · trait · impl · each · where · break · continue · fn · return · use · include · switch · case · export · node · on · and · or · by · then · with · mut · let · as · system · match · outer · from · parallel · when</p><p><code>outer</code> is a statement word only at the start of a line followed by names (<code>outer A, B</code>), so a variable called <code>Outer</code> still works. <code>system</code> is still reserved so the old <code>system Name on Phase</code> form gets a pointed error. Type names and builtin names are separate from this keyword list. Keywords are matched case-insensitively, so <code>In</code> and <code>On</code> are keywords too (node ports accept <code>In</code>).</p>'),
    section('traps','Common syntax traps','<ul><li><code>abs(x)</code> is absolute value; <code>[x]</code> is a one-element array (legacy bracket-abs still parses unless <code>OURO_GRAPH_STRICT</code>).</li><li>Use spaces around subtraction. The lexer can tokenize a minus immediately before digits as a negative literal.</li><li>Prefix <code>*</code> is dereference; infix <code>*</code> is multiplication.</li><li><code>^</code> belongs to math-power or condition-XOR parsing depending on context.</li><li><code>??</code> is falsy coalescing, not null-only coalescing.</li><li><code>fmt</code> prints an AST summary; it does not rewrite source.</li><li>write <code>a &gt; -1</code> for a comparison (no spacing-sensitive digraphs).</li><li><code>| when …</code> opens an arrow condition; write <code>- abs(x)</code> for minus absolute value.</li><li><code>A, B |&gt; F</code> fans several inputs into one node.</li><li><code>[50, 99] ||&gt; F</code> at the start of a statement reads as a tag gate; bind the array to a name first.</li></ul>')
  ]);

  const FEATURES = [
    ['@ASM snippet','@ASM … end',X64,'assembly'],
    ['@ASM whole-file program','a file that is one @ASM … end block',X64,'assembly'],
    ['Absolute value','abs(x)',ALL,'operators'],
    ['Address-of','&V',ALL,'pointers'],
    ['AddComp / HasComp / RemoveComp','AddComp(E, Shield, 5)',ALL,'project-files'],
    ['Alloc / Free','mut P = Alloc(64)',ALL,'pointers'],
    ['Append / Exists / Delete / JoinPath','Append(path, text)',ALL,'io'],
    ['Arenas','ArenaNew / ArenaAlloc / ArenaReset / ArenaDestroy',ALL,'ownership'],
    ['Array literal','[1, 2]  [7]  []',ALL,'collections'],
    ['Array element write','A[i] = v   A[i] += 1',ALL,'collections'],
    ['Array range literal','[1 to 5]',ALL,'collections'],
    ['Array push / pop / insert / clear','Push(A, v)',ALL,'collections'],
    ['Arrow flow','x |> F |> G',ALL,'pipes'],
    ['Arrow store','x |> Name   x |> A.B   x |> A[i]',ALL,'pipes'],
    ['as-stage','x |> as Name',ALL,'pipes'],
    ['AsDyn / dynamic trait values','AsDyn(Draw, &Shape)',ALL,'generics-traits'],
    ['Atomics','AtomicI64, AtomicAdd, AtomicCas',ALL,'concurrency'],
    ['Audio and music','LoadSound, PlaySound, MusicPlay',st('no','excised'),'limitations'],
    ['Backends','--backend auto | c | x64','—','backends'],
    ['Bitwise builtins','BitAnd BitOr BitXor Shl Shr',ALL,'operators'],
    ['BitCast','BitCast(*T, P)',ALL,'pointers'],
    ['Block comments','/* … */ (nestable)',ALL,'lexical'],
    ['Booleans','true  false',ALL,'types'],
    ['Box physics','BodyBox, PhysStep, BodyY',st('no','excised'),'limitations'],
    ['break / continue','break   break Outer   continue',ALL,'control-flow'],
    ['Buf byte spans','MakeBuf, BufLen, BufSlice',ALL,'slices'],
    ['By-ref parameters','void Inc(N) N += 1 end',ALL,'functions'],
    ['Catch','f |? Handler',ALL,'errors'],
    ['Characters','\'A\'  \'\n\'',ALL,'lexical'],
    ['Chimera emit','build/chimera file.ouro -o out.c','—','cli'],
    ['Clamp / Min / Max / Abs / Sign / Sqrt / Rand','Clamp(X, 0, 9)',ALL,'operators'],
    ['Comments','// text',ALL,'lexical'],
    ['Comparisons','== != < > <= >=',ALL,'operators'],
    ['Compound assignment','+= -= *= /= %=',ALL,'bindings'],
    ['Compound (classic spelling)','mut Hp = + 1',ALL,'bindings'],
    ['Conditional flow','x | when c |> F',ALL,'pipes'],
    ['Condition logic','&& || and or & | ^ ! ~',ALL,'operators'],
    ['Constant binding','let Limit = 100',ALL,'bindings'],
    ['Copy / Fill','Copy(dst, src, n)',ALL,'slices'],
    ['Defaults for parameters','fn Scale(V, mut F = 2)',ALL,'functions'],
    ['Dereference','*P   (*P).X   P.X',ALL,'pointers'],
    ['Despawn / DespawnById','Despawn(E, slot)',ALL,'project-files'],
    ['Entry file','tools/ouro_run.bat game/main.ouro','—','project-files'],
    ['Dt / FixedDt / Time / SetFixedDt / Quit','SetFixedDt(0.016)',st('no','excised'),'limitations'],
    ['each (binder form)','each P in Player where P.Hp > 0 … end',ALL,'project-files'],
    ['each (ambient form)','each Player … Health … Id … end',st('part','see limits'),'project-files'],
    ['each over several entities','each A, B … end',ALL,'project-files'],
    ['Empty-left / guard','|> F   | when c |> F',ALL,'pipes'],
    ['Entity archetype','entity Player … end',ALL,'project-files'],
    ['Entity flow','Player ||> Update   Player ||> Heal when Hp < 5',ALL,'project-files'],
    ['Entity lookup','FindId(E, id)   Enemy@10',ALL,'project-files'],
    ['enum','enum State … end   mut Idle = 3',ALL,'records'],
    ['export','export ScaleUp',ALL,'modules'],
    ['Fail','Fail("msg")   x | when c |> Fail("msg")',ALL,'errors'],
    ['File text I/O','Read(path)   Write(path, text)',ALL,'io'],
    ['File binary I/O','ReadBin / WriteBin',ALL,'io'],
    ['Float literals','1.5  2e3  1.5f  0.1f64',ALL,'lexical'],
    ['Floor / ceiling','{x}  ⌊x⌋  ⌈x⌉',ALL,'operators'],
    ['fn functions','fn F(X) … return X end',ALL,'functions'],
    ['for … to … by','for mut I = 10 to 1 by -1',ALL,'control-flow'],
    ['for … in','for X in Arr   for K, V in M',ALL,'control-flow'],
    ['Funnel','a, b |> F',ALL,'pipes'],
    ['Generics','struct Pair[T]   fn Id[T](v: T)',ALL,'generics-traits'],
    ['outer','outer Score, Lives',ALL,'bindings'],
    ['Get with default','Get(M, "k", 0)',ALL,'collections'],
    ['Has / Del / Keys / Values','Has(M, potion)',ALL,'collections'],
    ['Hex / binary literals','0xFF  0b1010  0o17  1_000',ALL,'lexical'],
    ['if / elseif / else','if c … elseif d … else … end',ALL,'control-flow'],
    ['if-expression','if c then a else b',ALL,'operators'],
    ['include','include "systems.ouro"',ALL,'modules'],
    ['Inclusive range','a..b',ALL,'operators'],
    ['Inclusive slice','S[a..b]   Arr[a..b]',ALL,'operators'],
    ['Input / InputNorm','mut Line = InputNorm()',ALL,'io'],
    ['Integer literals and suffixes','42  42i32  7u8',ALL,'lexical'],
    ['Interpolation','"Hp: $Hp"   "${Name}"   "$$"',ALL,'strings'],
    ['Iterate / map','mut D = Nums ||> Double',ALL,'pipes'],
    ['Iterate with filter','Nums ||> F',ALL,'pipes'],
    ['Job queues and graphs','JobQueueNew, JobSpawnAfter',ALL,'concurrency'],
    ['Keywords','if … end … node on …','—','syntax-reference'],
    ['Labeled loops','Outer: while … break Outer',ALL,'control-flow'],
    ['Loop / map edge','xs ||> F   xs ||> F when It > 0',ALL,'pipes'],
    ['Maps','{ gold: 10 }   M["k"] = v',ALL,'collections'],
    ['Match chain','x | match It == 1 -> "one" | _ -> "other" end |> F',ALL,'pipes'],
    ['Multi-value case / case range','case "a", "b"   case 1 to 5',ALL,'control-flow'],
    ['Mutable binding','mut X = v   mut X = v',ALL,'bindings'],
    ['Mutexes','MutexNew, MutexLock',ALL,'concurrency'],
    ['Node','node N in[A: i32] out[R] …',ALL,'nodes'],
    ['Node categories','Physics.Damage',ALL,'project-files'],
    ['Null-ish coalescing','x ?? y',ALL,'operators'],
    ['on phase blocks','on Start / FixedTick / Tick / Shutdown',st('no','excised'),'limitations'],
    ['Own / Rc','OwnNew, RcNew, RcClone, Drop',ALL,'ownership'],
    ['Phase calls','Start()  Tick()',st('no','excised'),'limitations'],
    ['PhysX / Flow / Blast','PxInit, FlowInit, BlastInit',st('no','excised'),'limitations'],
    ['Pipe sequence','x |> F |> G',ALL,'pipes'],
    ['Play host','excised engine host',st('no','excised'),'limitations'],
    ['Pointers','*T',ALL,'pointers'],
    ['Power / root','2 ^ 8   √x',ALL,'operators'],
    ['Print','Print(a, b)   x |> Print',ALL,'io'],
    ['Reactive binding','Q |! Double |> R',ALL,'pipes'],
    ['record','record Hero … end   Hero{}   NewRecord(Hero)',ALL,'records'],
    ['Record fields','H.Health   GetField   SetField',ALL,'records'],
    ['Record conversion','ToMap / Pack / Unpack / Clone',ALL,'records'],
    ['Recursion','fn Fib(N) … Fib(N - 1) …',ALL,'functions'],
    ['Rendering','SetCamera3D, DrawBox, SetMaterial',st('no','excised'),'limitations'],
    ['return','return value',ALL,'functions'],
    ['Slice(T) typed views','MakeSlice, SubSlice, S[i].F',ALL,'slices'],
    ['Slice of text (end-exclusive)','Slice(S, 0, 3)',ALL,'strings'],
    ['Spawn','Spawn(Player)',ALL,'project-files'],
    ['Step','count++   count--',ALL,'bindings'],
    ['String functions','Trim, ToUpper, Contains, Replace, Split, Join',ALL,'strings'],
    ['String literals and escapes','"a\tb\n"   "\x41"',ALL,'lexical'],
    ['struct','struct Vec3 X f32 … end',ALL,'structs'],
    ['SizeOf / AlignOf / OffsetOf','SizeOf(Vec3)',ALL,'structs'],
    ['Subject gate','x |> [It > 0] F',ALL,'pipes'],
    ['switch','switch X case … else … end',ALL,'control-flow'],
    ['system Name on Phase','(removed; use on blocks)',st('no','removed'),'limitations'],
    ['Tag gate','[Health < 5] |> Alert()',ALL,'control-flow'],
    ['Textures, fonts, input, UI','LoadTexture, DrawText, KeyDown, UiButton',st('no','excised'),'limitations'],
    ['then / else stage','x |> then A else B',ALL,'pipes'],
    ['Threads','SpawnThread, JoinThread',ALL,'concurrency'],
    ['trait / impl','trait Draw … end   impl Circle: Draw',ALL,'generics-traits'],
    ['Type annotation','mut speed: i32 = 5   mut pos: f32',ALL,'bindings'],
    ['Type-name conversion','i32(X)   X |> f32',ALL,'types'],
    ['Typed save','Write(p, M)   Read(p, Hero)',ALL,'io'],
    ['UFCS method calls','Words.Len()   Inv.Has(k)',ALL,'functions'],
    ['Unicode operators','× ÷ √',ALL,'lexical'],
    ['use','use "lib/"   use "x.var"',ALL,'modules'],
    ['.var / .com / .ent / .nod / .dom side files','world.var  Body.com  player.ent  Physics.nod  Vec.dom',ALL,'project-files'],
    ['void procedures','void Log(M) … end',ALL,'functions'],
    ['while','while c … end',ALL,'control-flow'],
    ['with','with mut S = FindId(E, id) … end',ALL,'control-flow'],
    ['World save','SaveWorld(E, path)   LoadWorld(E, path)',ALL,'project-files'],
    ['Multi-line strings','"""…"""',ALL,'strings'],
    ['Interpolated expressions','"${Len(Items)} items"',ALL,'strings'],
    ['Folders: ListDir / IsDir / MakeDir / CopyFile','ListDir("pages")',ALL,'web'],
    ['HTML / URL escaping','HtmlEscape(T)  UrlEncode(T)  UrlDecode(T)',ALL,'web'],
    ['Open in browser','OpenUrl("public/index.html")',ALL,'web'],
    ['HTTP server','HttpListen / HttpListenPublic / HttpAccept / HttpRespond',ALL,'web'],
    ['HTTP request data','HttpMethod  HttpPath  HttpQuery  HttpForm  HttpHeader  HttpBody',ALL,'web'],
    ['HTTP response headers','HttpSetHeader(R, "Cache-Control", "no-store")',ALL,'web'],
    ['HTTP client (http:// and https://)','HttpGet  HttpPost  HttpRequest(method, url, body, headers)',ALL,'web'],
    ['HTTP response data (client)','HttpStatus()  HttpResponseHeader(name)  HttpError()',ALL,'web'],
    ['File uploads','HttpFile(R, "photo")  HttpFileName  HttpFileType',ALL,'web'],
    ['Many connections / keep-alive','HttpAccept (event loop)',ALL,'web'],
    ['Routes','RouteMatch("/users/:id", P)  RouteParams(…)',ALL,'web'],
    ['Cookies','HttpCookie(R, "id")  HttpSetCookie(R, "id", V, "Path=/")',ALL,'web'],
    ['Redirects','HttpRedirect(R, "/done")',ALL,'web'],
    ['Static files with caching','HttpRespondFile(R, "public" + Path)',ALL,'web'],
    ['JSON','ToJson(V)  ToJsonPretty(V)  FromJson(T)',ALL,'web'],
    ['JSON paths','JsonGet(T, "a.b[0]")  JsonHas  JsonType  JsonLen',ALL,'web'],
    ['Dates and times','Now()  FormatTime(T, "%F")  ParseTime  TimeIso  MakeTime',ALL,'web'],
    ['Templates','RenderTemplate("page.html", Data)  {{#each}}',ALL,'web'],
    ['Markdown','Markdown(T)  MarkdownSafe(T)',ALL,'web'],
    ['Query strings','UrlQuery({"q": "a b"})',ALL,'web'],
    ['Environment variables','Env("PORT")',ALL,'web'],
    ['File size / time','FileSize(P)  FileTime(P)',ALL,'web'],
    ['Sleep','Sleep(250)',ALL,'web'],
    ['Dev server with live reload','not in Chimera toolchain yet',st('no','deferred'),'web'],
    ['HTTPS server','HttpListenTls(443, "cert.pem", "key.pem")',ALL,'web'],
    ['WebSockets','WsUpgrade(R)  WsSend(W, text)  HttpMethod(R) == "WS"',ALL,'web'],
    ['WebSocket client','WsConnect("wss://…")  WsReceive(W)',st('ok','interp · C · x64 · wasm'),'web'],
    ['HTTP/2 server (ALPN h2, h2c)','HttpListenTls / HttpListen (automatic)',ALL,'web'],
    ['TLS 1.3, RSA and EC keys','HttpListenTls(443, "cert.pem", "ec_key.pem")',ALL,'web'],
    ['Blocking calls in the browser','Sleep  HttpGet  SpawnThread  JoinThread in a page',st('ok','wasm (Asyncify)'),'browser'],
    ['SQLite in the browser','DbOpen("notes.db") + Ouro.run(…, {persist: "app"})',st('ok','wasm'),'browser'],
    ['SQLite database','DbOpen  DbExec(Db, sql, {})  DbQuery  DbLastId',ALL,'web'],
    ['Ouro in the browser (WebAssembly)','not in Chimera day-to-day path',st('part','smoke only'),'browser'],
    ['DOM builtins','DomSetText  DomGetValue  DomOn(sel, "click", F, N)',st('ok','page · simulated elsewhere'),'browser'],
    ['Unicode text','Len("Café") = 4   ToUpper("ß")   for C in S   "\u{1F600}"',ALL,'strings'],
    ['Bytes and code points','ByteLen  Bytes  Ord  Chr',ALL,'strings'],
    ['C libraries (extern)','extern "libc.so.6"  fn strlen(S: CStr) -> u64  end',ALL,'ffi'],
    ['C callbacks / variadics','Cmp: fn(*u8, *u8) -> i32   fn printf(Fmt: CStr, ...)',ALL,'ffi'],
    ['ReadCStr','ReadCStr(P)',ALL,'ffi'],
    ['Math notation','@Math  2x^2 + 3x   Σ_{i=1}^{n} i^2   \frac{a}{b}',ALL,'math-notation'],
    ['Math derivatives','∂(x^2)/∂x   ∇F(W)',ALL,'math-notation'],
    ['Complex numbers','3+2i   conj(Z)   |Z|   Z.Re',ALL,'math-notation'],
    ['Vectors / matrices','u+v   u·v   u×v   A×B   Aᵀ   |v|',ALL,'math-notation'],
    ['Folds','Xs |> Add from 0   parallel Xs |> Add from 0',ALL,'pipes'],
    ['Inclusive funnel slice','Arr, 1, 2 |> Slice',ALL,'pipes'],
    ['Parallel each','Enemies ||>> Think',ALL,'pipes'],
    ['Flows over entities','Player | when Score > 50 |> Walk   Player ||>> Think',ALL,'project-files'],
    ['Ownership arrows','A |=> B   R |+> X, Y   A |->',ALL,'ownership'],
    ['Ownership nested / traits / callbacks','Rows[0][0] = P   Eat(&C, Q)   FFI callback Free rejected',ALL,'ownership'],
    ['Parallel atomic heap','retain/release while ||>> / |> from jobs run',ALL,'concurrency'],
    ['Components (.com)','component Health … end   entity Hero uses Health',ALL,'project-files'],
    ['Domains (.dom)','domain Vec  · := Dot  end   @Vec  A · B',ALL,'project-files'],
    ['What\'s new page','#whats-new',ALL,'whats-new']
  ];
  const letters = [...new Set(FEATURES.map(f => (f[0].match(/[A-Za-z]/) || ['#'])[0].toUpperCase()))].sort();
  add('feature-index','Reference','Feature index (A–Z)','Every construct in the language with its syntax, where it runs, and the page that explains it.',[
    section('fi-legend','Reading the index', `<p>${ALL} runs in the interpreter and on the C and x64 backends with identical output. ${X64} needs the x64 backend. ${st('part','see limits')} works with a documented restriction. ${NOTYET} is not available; the row names what to use instead. Builtin functions have their own <a href="#api">API index</a>.</p><div class="letter-jump">${letters.map(l => `<a href="#feature-index/fi-${l}">${l}</a>`).join('')}</div>`),
    ...letters.map(l => section(`fi-${l}`, l, table(['Feature','Syntax','Status','Guide'], FEATURES.filter(f => (f[0].match(/[A-Za-z]/) || ['#'])[0].toUpperCase() === l).sort((a, b) => a[0].localeCompare(b[0])).map(f => [f[0], C(f[1]), f[2], `<a href="#${f[3]}">{{title:${f[3]}}}</a>`]))))
  ]);

  add('limitations','Reference','Compatibility & known limitations','Make backend and safety assumptions visible before shipping.',[
    section('compatibility-policy','Backend policy','<p>The C, x64 and WebAssembly builds share the typed IR and the runtime, and must print what the interpreter prints. A construct the IR does not cover makes the native build fail with its name (see <code>dump-ir</code>); such a program still runs in the interpreter. Check individual programs with dump-ir and focused regression tests.</p>'),
    section('known-gaps','Known gaps', table(['Area','Current limitation','Recommendation'],[['Unicode','Characters are code points, not grapheme clusters; tables are Unicode 14','Normalize or segment text yourself when combining marks matter.'],['Ownership','Moves, releases (through aliases, nested containers, calls and trait methods), arena lifetimes and shared data between threads are checked; FFI callbacks that Free/move are rejected','Keep callback bodies free of Free / Drop / Own moves.'],['C libraries','Callbacks run on the calling thread only; no extern calls in the browser','Wrap callback-heavy or threaded APIs in a small C library.'],['Systems functions','Typed local/whole-struct value support is restricted','Use tested pointer/slice patterns and inspect IR coverage.'],['Reactive bindings','Element, field and by-ref parameter writes do not rerun a <code>|!</code> chain','Write the whole value (or <code>|&gt; Q</code>) when dependents must update.'],['Functions called from each','Inside <code>each Player</code> (and in a function every call of which sits in such a loop) <code>Health</code> and <code>Player_Health</code> name the current entity’s value; a function also called outside the loop sees the whole column there','Pass the value or the slot as an argument when one function serves both.'],['Inline assembly','x64 only; snippets are Win64 MASM','Keep snippets small and follow the register contract.'],['Local shadowing a global','A function that assigns a fresh name which also exists at the top level writes the outer (that is the scope rule); the IR refuses the ambiguous case','Give function locals their own names, or pass the value as a parameter.'],['Push onto an entity column inside each','<code>Push</code> / <code>Pop</code> / <code>Insert</code> onto any other array works inside <code>each</code>; an entity column of the loop is refused natively','Use <code>Spawn</code> / <code>Despawn</code> to change the population.'],['Web','The HTTP client speaks HTTP/1.1 (servers speak HTTP/1.1 and HTTP/2); handlers run one request at a time (the I/O around them is concurrent)','Keep handlers short; use a reverse proxy for automatic certificate renewal.'],['Thread safety','Ordinary workers take turns under one lock (released while waiting in HttpAccept, client calls or Sleep). While parallel jobs run, refcounts are atomic and Print is locked, so number-only and heap-safe <code>||&gt;&gt;</code> / <code>|&gt; from</code> bodies skip that lock. Shared container mutation still needs partitioning or a Mutex / AtomicI64','Prefer number-only or local-heap nodes for CPU work; guard shared writes.'],['Runtime errors vs Fail','A runtime error (index out of range, <code>for K, V</code> over an array) stops a native program but is reported and skipped in the interpreter; only <code>Fail</code> (and builtins that raise it: FromJson, ParseTime, templates) can be caught with <code>|?</code>','Validate input before using it; raise <code>Fail</code> yourself for errors a caller should handle.']])) ,
    section('validation-status','Recorded validation','<p>The latest full Windows run of the regression harness passed all 215 entries: 205 program cases, the check-only negative cases, and the scripted LSP session. Every program case builds natively except the six deliberate error cases: the C backend matched the interpreter on 195 programs and x64 on 199 (x64 also runs the four @ASM cases); the same suite passed under WSL with gcc (C on 195). The unit tests pass: syntax (38), engine foundation, the web tests (tests/test_web.py: HTTP and HTTPS servers and clients with RSA and EC keys over TLS 1.3, uploads and WebSockets over real sockets in the interpreter, C and x64; tests/test_web_concurrency.py), HTTP/2 (tests/test_http2.py with the <code>h2</code> package as the client, over ALPN and h2c; tests/test_h2server.py against the <code>hpack</code> encoder; curl with nghttp2 under WSL), the WebSocket client (tests/test_ws_client.py, also in the browser build), the dev server, and the browser build (tests/test_wasm.py: 21 regression cases including threads, jobs and SQLite compiled to WebAssembly and run in Node, blocking calls, persistence, page events). The example page also ran in a real browser, with its SQLite data surviving a reload through IndexedDB. The JSON, time, template and Markdown twins were additionally fuzzed against each other (thousands of random inputs, byte-identical output). This is a snapshot of the development checkout, not a release certification.</p>'),
    section('roadmap','What remains','<p>Language bootstrap still in flight: broader <code>OURO_GRAPH_STRICT</code> suite coverage, race-safe shared containers, more FFI surface, and production-grade math/types libraries. Compiler, ownership, web, and WASM paths are the documented focus of this checkout. Engine milestones (asset pipeline, RHI, audio, physics, editor tooling) were excised with the <code>play</code> harness — see <code>ROADMAP.txt</code> for the language-only bootstrap list.</p>')
  ]);

  const WHEN = {
    bindings: choose(['<code>mut X = …</code> for any value your program updates.','<code>let X = …</code> for tuning values and limits; the checker then rejects any later rebinding.','<code>mut speed: i32 = 5</code> when width matters: struct fields, node ports, data shared with native code.','<code>outer Name</code> when a function must write a top-level binding.'], ['You are tempted to annotate every script variable: inference already picks a fitting width.','Legacy <code>:=</code> / <code>=:</code> / <code>global</code> still parse during dual-accept; new code should not use them.']),
    types: choose(['Let inference choose widths for script values; check the result with <code>check --types</code>.','Convert explicitly with <code>Str()</code>, <code>Int()</code> and <code>Float()</code> when text and numbers meet.','Use literal suffixes (<code>1.5f32</code>, <code>7u8</code>) when a value must have a precise width.'], ['You convert untrusted text with <code>i32(X)</code>: a value that does not parse or does not fit is an error; use <code>Int()</code> when 0 is an acceptable fallback.','Values of different kinds flow into one variable: the checker infers Dyn; keep one kind per variable when you can.','You need f128 precision: native paths widen it to f64.']),
    operators: choose(['Parenthesise whenever you mix arithmetic, comparisons and pipes.','<code>??</code> for a quick fallback when 0, "" and false all mean “missing”.','Ranges <code>a..b</code> for loops and slices (half-open under <code>OURO_GRAPH_STRICT</code>).','<code>**</code> for power outside logic; <code>^</code> is XOR in conditions.'], ['Zero or an empty string is a valid value: test with <code>==</code> instead of <code>??</code>.','A whole-number product or power can exceed 64 bits: that is an overflow error, not a wrap; use floats for very large magnitudes.','You rely on short-circuit evaluation to avoid a call: nest <code>if</code>s instead.']),
    strings: choose(['Interpolation <code>"Hp: ${Hp}"</code> for messages built from expressions.','<code>Join</code> for many parts, <code>Split</code> for simple separated text.','<code>S[a..b]</code> for slices.'], ['Bare <code>$Name</code> still works during dual-accept; prefer <code>${…}</code>.','Text is not ASCII and you index or change case: native paths are byte-oriented.','You process binary data: use <code>Buf</code> or <code>ReadBin</code>, not ordinary strings.']),
    collections: choose(['Arrays for ordered values you append to and loop over.','Maps for lookups by text key, with <code>Get</code> for defaults.','<code>Nums ||&gt; F</code> to build a transformed array in one line.'], ['Keys are fixed field names: a record is clearer and checked.','You need packed, typed elements in a hot loop: <code>Slice(T)</code> over typed memory.','You index maps with numbers: map keys are strings (the checker reports it).','You push onto an array inside <code>each</code> on the IR backends: collect in a <code>while</code> loop instead.']),
    'control-flow': choose(['<code>if</code> blocks when there are several branches or several statements per branch.','<code>for … to</code> for counted loops, <code>for X in A</code> for collections.','<code>switch</code> for many fixed string or integer cases with blocks.'], ['One guarded action: <code>| when c |&gt; Action</code>.','A value chosen by cases: <code>match</code>.','Transforming every element: <code>||&gt;</code>.','Multi-statement loops: <code>while</code> inside the node.']),
    functions: choose(['<code>fn</code> for computations that return a value; <code>void</code> for procedures.','Default parameters for optional arguments.','By-ref parameters when a procedure must update the caller’s variable.','<code>outer Name</code> when a procedure must change a top-level variable (names a function assigns are otherwise its own locals).'], ['You want named inputs and several named results: a <a href="#nodes">node</a>.','The mutation-through-parameter is surprising to readers: return the new value instead.','You need closures or first-class functions: they are not part of the language; pass data and call named functions.']),
    pipes: choose(['A linear transformation reads naturally left to right: <code>Raw |&gt; Trim |&gt; ToLower</code>.','Several inputs feed one call: <code>a, b |&gt; F</code>.','Map / fold / parallel: <code>||&gt;</code>, <code>|&gt; F from seed</code>, <code>||&gt;&gt;</code>.','A value should follow another automatically: <code>|!</code>.'], ['The chain needs several statements per step: write ordinary statements inside the node.','You would need parentheses to explain the precedence: bind intermediate names.','Legacy arrow glyphs: prefer the graph dialect; see <a href="SYNTAX_GRAPH.md">SYNTAX_GRAPH.md</a>.']),
    nodes: choose(['A unit of logic has named inputs and several named outputs.','You want logic grouped into categories (<code>Physics.Damage</code>) across a project.','The same unit is called in many styles: <code>N(a, b)</code>, <code>a, b |&gt; N</code>, <code>Xs ||&gt; N</code>.'], ['You need <code>return</code> or an early exit: nodes have none; use <code>fn</code>.','The result is a single value used once: a function is lighter.','A node would share a function’s name: names must be unique.']),
    errors: choose(['A deeper call cannot continue and the caller may know how to recover.','You want a phase to stop cleanly on a broken invariant.'], ['The outcome is normal (not found, empty input): return a value and test it.','You want cleanup on every path: there is no <code>finally</code>; structure the code so cleanup runs after the catch.']),
    records: choose(['A named bundle of fields with defaults: <code>record</code> + <code>Hero{}</code>.','An enum for a closed set of states.'], ['Exact memory layout or pointers: <code>struct</code>.','Open-ended keys: a map.','Many instances iterated every frame: an <code>entity</code>.']),
    modules: choose(['<code>use</code> to bring in a library’s exported functions and its side files.','List project layers in <code>ouroboros.project</code> instead of relying on silent ancestor discovery.'], ['You only need shared values: a .var file next to the scripts.','Legacy <code>include</code> still splices files during dual-accept; new code should <code>use</code> instead.']),
    io: choose(['<code>Read</code> / <code>Write</code> for small text files and saves.','<code>Write(path, M)</code> / <code>Read(path, Hero)</code> for a typed record save.','<code>SaveWorld</code> / <code>LoadWorld</code> for entity columns.'], ['The data must survive format changes: these formats have no versioning; add your own version field.','Binary data: <code>ReadBin</code> / <code>WriteBin</code>.','You need atomic writes or locking: write to a temporary file and rename it yourself.']),
    structs: choose(['You need exact field widths, offsets and alignment.','Data is passed to native code or packed into slices.'], ['Ordinary named data: a record is simpler.','You need to pass whole structs by value through many functions: prefer pointers or slices (whole-value passing is restricted).']),
    pointers: choose(['You need a typed view of raw memory or the address of a struct.','Interfacing with Alloc, arenas and BitCast.'], ['Traversing elements: use <code>Slice(T)</code>, which checks bounds.','Ownership matters: use <code>Own</code> or <code>Rc</code> so cleanup is tracked.']),
    slices: choose(['Contiguous typed elements in hot loops: <code>Slice(T)</code>.','Raw byte processing: <code>Buf</code>.'], ['You need a growable list: an array.','The backing memory might be freed while the view lives: keep the owner alive or copy.']),
    ownership: choose(['Arenas for many allocations with one lifetime (per frame, per level).','<code>Own</code> for a single owner; <code>Rc</code> when several holders share.'], ['Values are ordinary strings, arrays, maps or records: they already manage themselves.','Threads share the value: Rc counts are not atomic.']),
    'generics-traits': choose(['Generics when one layout or function should work for several concrete types.','Explicit traits when you need dynamic dispatch through <code>*dyn Trait</code>.'], ['Implicit checking already covers you: untyped parameters work with any value that supports the operations.','You need runtime type inspection: generics are monomorphised at compile time.']),
    concurrency: choose(['A few long tasks: threads.','Many small tasks: a job queue; tasks with dependencies: a job graph.','CPU-bound entity work or folds: number-only or heap-safe <code>||&gt;&gt;</code> / <code>|&gt; from</code> so they use every core while jobs run.'], ['Tasks mutate the same string/array from several workers: partition the data or take a Mutex; ordinary workers still serialize under the runtime lock.','You expect systems <code>Rc</code> to be atomic across threads: it is not; use atomics or redesign sharing.']),
    web: choose(['Pages are the same for every visitor: generate them with a build program (Markdown + templates) and serve the folder.','You need forms, a JSON API or a local tool: run a server with routes, cookies and JSON via <code>ouro-run</code>.','You fetch data from another http:// service: HttpGet / HttpRequest + FromJson.'], ['The site faces the internet and you do not want to manage certificates in your program: keep the Ouro server behind a reverse proxy (or use <code>HttpListenTls</code> with your certificate files).','You need HTTP/2 or automatic certificate renewal: put a reverse proxy in front.','The page itself needs to react to clicks and input: use a small script or wait for Chimera browser packaging (<a href="#browser">Ouro in the browser</a>).']),
    assembly: choose(['A tiny hot spot or an instruction the language cannot express.','Learning or testing x64 code next to Ouro values.'], ['The code must run on Linux or the C backend: @ASM is x64 only.','The same logic can be written in Ouro: the compiler and register allocator keep it portable and checked.'])
  };
  pages.forEach(p => {
    if (WHEN[p.id]) p.sections.splice(1, 0, section(`${p.id}-when`, 'When to use it', WHEN[p.id]));
    p.sections = p.sections.map(s => s.replace(/\{\{title:([\w-]+)\}\}/g, (_, id) => esc((pages.find(q => q.id === id) || {title: id}).title)));
  });
  return {pages, esc, code, section};
})();
