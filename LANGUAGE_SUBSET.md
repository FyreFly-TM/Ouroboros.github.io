# Language subset vs Chimera freeze

Day-to-day compile/run uses **Chimera** (`build/chimera`) + `ouro-link` / `ouro-run`. This note separates the broader language surface from the frozen dialect Chimera emits today.

## Language surface (handbook)

The main docs describe the language model: graph dialect pipes/folds/guards/match/catch, bindings, control flow, functions/nodes, records/maps/arrays/strings, systems memory (struct/pointer/slice/arena/Own/Rc/…), FFI, and web builtins. Not every surface is in the Chimera freeze yet—prefer the [self-host handbook](selfhost/) when shipping through Chimera.

## Excised (do not reintroduce in language core)

- `on Start|Tick|FixedTick|Shutdown`, `play`
- ECS `entity` / `each` / `Spawn` / `.ent` as a bundled host
- RHI / Vulkan / PhysX / audio / Ui / game input

## Chimera freeze (separate)

**Chimera** (`compiler/`, binary `build/chimera`) implements a **smaller freeze**: pipes/`||>`/folds/`| when`/`|?`/`| match`, map-backed records, LocalTy emit, monomorphic i64 structs, subset `use`/`include`, enums/generics/traits/`@Math`/web helpers as gated in fixtures. Documented in [`SELF_HOST.md`](SELF_HOST.md) and [`selfhost/`](selfhost/). Spellings that stay ouro-only for now (Own/Sys*, thin `extern`, subset generics/AsDyn, Exec/ListDir, …) live in `compiler/cases_ouro_only.txt`.

## Gates

```text
make tools-bootstrap
build/ouro-run-cases
build/ouro-fail-cases
tools/ouro_run.bat compiler/fixtures/hello.ouro
```

Stage fixed-point (maintainers): `make`-wrapped or `tools/self_host_stage2` entry after a seed binary exists. See [`SELF_HOST.md`](SELF_HOST.md).

## Status

Chimera self-host is stage-2 green via `compiler/main.ouro`. Broader language parity continues by growing the Chimera dialect, not by documenting a second host toolchain.
