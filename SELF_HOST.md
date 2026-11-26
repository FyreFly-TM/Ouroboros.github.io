# Self-host subset (Chimera)

**Chimera** (`build/chimera`) is the subset compiler. Day-to-day work uses Chimera + native `ouro-link` / `ouro-run` / case runners. After a seed binary exists, rebuild and gate without a second host toolchain.

**Self-hosted claim:** Chimera rebuilds itself (stage-2 gen1→gen3 fixed-point).

- **Campaign 15–19:** native link/run drivers, `ListDir` / `MakeDir` / `ExecCapture`, MSVC discovery in Ouro, CI seed artifacts via [`tools/self_host_fetch_seed.py`](../tools/self_host_fetch_seed.py).

## One-command rebuild

With a seed `build/chimera` already present (CI artifact or prior bootstrap):

```text
make tools-bootstrap
tools/self_host_stage2.py
```

(`tools/self_host_stage2.py` is a thin orchestrator that drives Chimera + native drivers.)

**Clean machine (prefer fetch):**

```text
tools/self_host_fetch_seed.py    # OURO_SEED_URL or gh run download
make tools-bootstrap             # if drivers missing from artifact
tools/self_host_stage2.py
```

**Clean machine (cold seed):** obtain `build/chimera` once via the stage-0 entry under `tools/`, then `make tools-bootstrap` and stage-2.

## Emit / link / run

```text
build/chimera prog.ouro -o prog.c
tools/ouro_link.bat prog.c -o prog.exe --out-dir build
prog.exe
```

Or one shot:

```text
tools/ouro_run.bat compiler/fixtures/hello.ouro
```

(`ouro_link.sh` / `ouro_run.sh` on Unix; `make link C=…` / `make ouro-run PROG=…` / `make tools-bootstrap`.)

Native `ouro-link` discovers MSVC via `ListDir` when `OURO_CC` is unset, and refreshes `build/ouro_*.txt`.

## Frozen subset

### Control flow & functions

- `fn` / `void` / `if` / `elseif` / `else` / `while` / `for` / `for-in` (array or map) / `return` / `break`
- `global` / `outer`
- Generics: `fn Id[T](...)`; calls `Id[Ty](...)` → `Id_Ty` (i64 and str)
- Enums + `switch` (arrow arms or host `case`/`else`)
- Traits / `impl Trait for Type` → mangled `Type_Trait_method`; `AsDyn` (identity + note)
- `extern "lib" fn Sym [as Alias]` → direct C symbol (ouro-only vs broader lower)

### Values

- Ints, strings, arrays, maps, records, structs (incl. nested; `struct Box[T]` → `Box_i64`)
- Modules: `use` / `include` + `export`; entry [`compiler/main.ouro`](../compiler/main.ouro)
- `@Math` strip + ASCII `sum(Var, Lo, Hi, Body)` → for-loop

### Builtins (selected)

`Print`, `Len`, `Str`/`Int`/`Ord`/`Chr`/`Slice`, I/O, `Push`/`Join`/`IndexOf`/`Fail`, `Exec` / `ExecCapture` / `ExecStatus` (argv string array only; no shell), `ListDir` / `MakeDir` / `IsDir` / `Exists`, `Own`/`Clone`/`SysAlloc`/`SysFree`, `HtmlEscape`/`Env`/`UrlEncode`/`MimeType`, `Exit`

### Pipes

`|>`, `| when`, `|?`, `||>`, `||>>`, `|> from`, `|>~` scan, `| match`, `-|>` reactive

### Check rejects

empty program / duplicate fn / unknown call / use-after-Own (`fail_cases.txt`)

## Case lists

| File | Gate |
|------|------|
| `compiler/cases.txt` | Chimera emit/run (stage-1/2) |
| `compiler/cases_ouro_only.txt` | Subset-only spellings / FFI / Own Sys* / Exec / ListDir |
| `compiler/fail_cases.txt` | Must `error:` (incl. Own move) |

## Stages

1. Seed artifact **or** cold stage-0 → `build/chimera`
2. `make tools-bootstrap` → `ouro-link` + drivers
3. Seeded rebuild of Chimera
4. Stage-1 emit+run / Stage-2 fixed-point (native drivers)
5. Optional wasm / LSP hybrid smokes

## Handbook

Interactive site: [`docs/selfhost/`](selfhost/). Main language docs: [`docs/`](./) (Chimera-first quickstart).
