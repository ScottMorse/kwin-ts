export interface BasePrivateMapConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type PrivateMapKey<C extends BasePrivateMapConfig> = keyof C;

export type PrivateMapValue<
  C extends BasePrivateMapConfig,
  K extends keyof C = keyof C,
> = C[K];

export interface PrivateMap<
  C extends BasePrivateMapConfig = BasePrivateMapConfig,
> {
  set<K extends PrivateMapKey<C>>(key: K, value: PrivateMapValue<C, K>): void;
  get<K extends PrivateMapKey<C>>(key: K): PrivateMapValue<C, K>;
  has<K extends PrivateMapKey<C>>(key: K): boolean;
  delete<K extends PrivateMapKey<C>>(key: K): void;
  readonly size: number;
  clear(): void;
  entries(): IterableIterator<[PrivateMapKey<C>, PrivateMapValue<C>]>;
  keys(): IterableIterator<PrivateMapKey<C>>;
  values(): IterableIterator<PrivateMapValue<C>>;
  forEach(
    callbackfn: <K extends PrivateMapKey<C>>(
      value: unknown,
      key: PrivateMapKey<C>,
      map: PrivateMap<C>,
    ) => void,
    thisArg?: unknown,
  ): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const INSTANCE_TO_MAP_MAP = new WeakMap<object, Map<any, any>>();

export interface PrivateMapFactory<C extends BasePrivateMapConfig> {
  set(obj: object, initialValues: C): PrivateMap<C>;
  get(obj: object): PrivateMap<C>;
}

export interface CreatePrivateMapFactoryOptions<
  C extends BasePrivateMapConfig,
> {
  defaultInitialValues: C;
}

const setInternalPrivateMap = <C extends BasePrivateMapConfig>(
  obj: _PrivateMapFactory<C>,
  options: CreatePrivateMapFactoryOptions<C>,
) => {
  const map = new Map(Object.entries(options));

  INSTANCE_TO_MAP_MAP.set(obj, map);

  return map as PrivateMap<CreatePrivateMapFactoryOptions<C>>;
};

const getInternalPrivateMap = <C extends BasePrivateMapConfig>(
  obj: _PrivateMapFactory<C>,
) => {
  return INSTANCE_TO_MAP_MAP.get(obj) as PrivateMap<
    CreatePrivateMapFactoryOptions<C>
  >;
};

class _PrivateMapFactory<C extends BasePrivateMapConfig>
  implements PrivateMapFactory<C>
{
  constructor(options: CreatePrivateMapFactoryOptions<C>) {
    setInternalPrivateMap(this, options);
  }

  set(obj: object, initialValues: C): PrivateMap<C> {
    const map = new Map<PrivateMapKey<C>, PrivateMapValue<C>>(
      Object.entries(initialValues),
    );

    INSTANCE_TO_MAP_MAP.set(obj, map);

    return map as PrivateMap<C>;
  }

  get(obj: object): PrivateMap<C> {
    return (
      INSTANCE_TO_MAP_MAP.get(obj) ??
      this.set(obj, getInternalPrivateMap(this).get("defaultInitialValues"))
    );
  }
}

export const createPrivateMapFactory = <C extends BasePrivateMapConfig>(
  options: CreatePrivateMapFactoryOptions<C>,
) => new _PrivateMapFactory<C>(options);
