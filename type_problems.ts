// Tic Tac Toe game
// https://www.joshuakgoldberg.com/blog/type-system-game-engines/

// Test functions
export type Expect<T extends true> = T
export type ExpectTrue<T extends true> = T
export type ExpectFalse<T extends false> = T
export type IsTrue<T extends true> = T
export type IsFalse<T extends false> = T

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<T> = 0 extends (1 & T) ? true : false
export type NotAny<T> = true extends IsAny<T> ? false : true

export type Debug<T> = { [K in keyof T]: T[K] }
export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

export type ExpectExtends<VALUE, EXPECTED> = EXPECTED extends VALUE ? true : false
export type ExpectValidArgs<FUNC extends (...args: any[]) => any, ARGS extends any[]> = ARGS extends Parameters<FUNC>
  ? true
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

// Reverse a list
type Reverse<Remaining extends unknown[], Result extends unknown[] = []> =
  Remaining extends [infer First, ...infer Rest]
    ? Reverse<Rest, [First, ...Result]>
    : Result

export type TestReverseSortedTuple = Expect<Equal<
  Reverse<[1, 2, 3, 4]>,
  [4, 3, 2, 1]
>>

const countObj: Record<string, number> = {}
countObj.num = countObj.num + 1 || 1;
countObj.num = countObj.num + 1 || 1;
countObj.num = countObj.num + 1 || 1;

const arrObj: Record<string, number[]> = {}
arrObj.arr = arrObj.arr || [];
arrObj.arr.push(1)
arrObj.arr.push(2)
arrObj.arr.push(3)

console.log(countObj);
console.log(arrObj);


// implement Cap for capitalizing the first letter in a string
type Cap<Str extends string> = Str extends `${infer Front}${infer Rest}`
  ? `${Uppercase<Front>}${Rest}`
  : never

type Hello = Cap<'hello world'>;
export type TestCapitalize = Expect<Equal<Hello, 'Hello world'>> // expected to be 'Hello world'


// implement Pick

interface Todo {
  title: string
  description: string
  completed: boolean
}

type MyPick<Obj, Props extends keyof Obj> = {
  [Key in Props]: Props extends Key ? Obj[Key] : never
};

type PickTodoPreview = MyPick<Todo, 'title' | 'completed'>

export type TestPick = Expect<Equal<
  PickTodoPreview,
  {title: string, completed: boolean}
>>

// implement Exclude
// Are the elements in Collection wider or equal to Target?
type Exclude<Collection, Target> = Collection extends Target
  ? never
  : Collection

type Drinks = "coke" | "milk" | "water" | "coffee"

type RemoveCoke = Exclude<Drinks, 'coke'>
export type TestExclude = Expect<Equal<
  RemoveCoke,
  "milk" | "water" | "coffee"
>>;

interface Todo {
  title: string
  description: string
  completed: boolean
};

type MyOmit<Obj extends object, Props extends keyof Obj> = {
  [Key in keyof Obj as (Key extends Props ? never: Key)]: Obj[Key]
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

export type TestOmit = Expect<Equal<TodoPreview, {completed: boolean}>>;


// implement concat
type Concat<A extends unknown[], B extends unknown[]> = [
  ...A,
  ...B,
]

type ConcatRes = Concat<[1], [2]>
export type TestConcat = Expect<Equal<
  ConcatRes,
  [1, 2]
>>


// 4. implement First
type MyFirst<List extends unknown[]> =
  List extends [infer Front, ...infer _Rest]
    ? Front
    : never

type FirstRes = MyFirst<[1, 2]>
export type TestFirst = Expect<Equal<
  FirstRes,
  1
>>


// 5. implement If
type If<Comparitor extends boolean, IfTrue, IfFalse> =
  Comparitor extends true
    ? IfTrue
    : IfFalse

type IfResTrue = If<true, 'a', 'b'>
type IfResFalse = If<false, 'a', 'b'>
export type TestIfTrue = Expect<Equal<
  IfResTrue,
  'a'
>>
export type TestIfFalse = Expect<Equal<
  IfResFalse,
  'b'
>>


// 4. implement TupleToObj
const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type TupleToObj<List extends readonly PropertyKey[]> =
  {
    [Key in List[number]]: Key
  }


type TupleToObjRes = TupleToObj<['tesla', 'model 3', 'model X', 'model Y']>
export type TestTupleToObj = Expect<Equal<
  TupleToObjRes,
  { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
>>


// 4. implement Unshift
type Unshift<List extends unknown[], Val> = [Val, ...List];

type UnshiftRes = Unshift<[1, 2], 0>
export type TestUnshift = Expect<Equal<
  UnshiftRes,
  [0, 1, 2]
>>

// ParseInt
type ParseInt<Num extends string> = Num extends `${infer Int extends number}` ? Int : Num;
type ParseIntRes = ParseInt<'-123'>

// 1. implement Absolute
type Absolute<Num extends string | number | bigint> = `${Num}` extends `-${infer AbsNum}`
    ? AbsNum
    : Num

export type TestAbsoluteInt = Expect<Equal<Absolute<-100>, "100">>
export type TestAbsoluteString = Expect<Equal<Absolute<"-100">, "100">>
export type TestAbsoluteBigInt = Expect<Equal<Absolute<-100n>, "100">>


// 2. implement AnyOf
type Falsy = 0 | "" | false | [] | {[K in PropertyKey]: never}
type AnyOf<List extends unknown[]> = List[number] extends Falsy ? false : true;

type Sample1 = AnyOf<[1, "", false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]> // expected to be false.
export type TestAnyOfTrue = Expect<Equal<Sample1, true>>
export type TestAnyOfFalse = Expect<Equal<Sample2, false>>


// 3. implement AppendArg

type AppendArg<Fn extends Function, Val> = Fn extends (...args: infer Args) => infer Ret
  ? (...args: [...Args, appendedArg: Val]) => Ret
  : never;

type TestAppendArg1 = AppendArg<(x: number, y: number) => number, string> // expected to be true.
export type TestAppendArg = Expect<Equal<
  TestAppendArg1,
  (x: number, y: number, appendedArg: string) => number
>>


// implement AppendToObj
type AppendToObj<Obj extends object, Key extends string, Val> = {
  [ObjKey in keyof Obj | Key]: ObjKey extends keyof Obj ? Obj[ObjKey] : Val
}

type Test = {id: '1'}
type TestAppendToObj1 = AppendToObj<Test, 'value', 4> // expected to be true.
export type TestAppendToObj = Expect<Equal<
  TestAppendToObj1,
  {id: '1', value: 4}
>>


// implement BEM
type BEM<Block extends string, Elements extends string[], Modifiers extends string[]> =
  Elements extends []
    ? Modifiers extends [] 
      ? Block
      : BemModifierRec<Block, Modifiers>
    : Modifiers extends []
      ? BemElementRec<Block, Elements>
      : BemElementRec<Block, Elements> extends (infer Item extends string)
        ? BemModifierRec<Item, Modifiers>
        : never

type BemElementRec<Block extends string, Elements extends string[], Accum = never> =
  Elements extends [infer First extends string, ...infer Rest extends string[]]
    ? BemElementRec<Block, Rest, Accum | `${Block}__${First}`>
    : Accum

type BemModifierRec<BlockElement extends string, Modifiers extends string[], Accum = never> =
  Modifiers extends [infer First extends string, ...infer Rest extends string[]]
    ? BemModifierRec<BlockElement, Rest, Accum | `${BlockElement}--${First}`>
    : Accum

export type BemCases = [
  Expect<Equal<BEM<'btn', ['price'], []>, 'btn__price'>>,
  Expect<Equal<BEM<'btn', ['price'], ['warning', 'success']>, 'btn__price--warning' | 'btn__price--success' >>,
  Expect<Equal<BEM<'btn', [], ['small', 'medium', 'large']>, 'btn--small' | 'btn--medium' | 'btn--large' >>,
]

// implement Chainable
type Chainable<Acc = {}> = {
  option<NewKey extends string, Val>(key: NewKey, value: Val):
    Chainable<{[Key in keyof Acc | NewKey]:
      Key extends NewKey
        ? Val
        : Key extends keyof Acc
          ? Acc[Key]
          : never
    }>
  get(): Acc
}

declare const a: Chainable

const result1 = a
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

const result2 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 'last name')
  .get()

const result3 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 123)
  .get()

export type ChainableCases = [
  Expect<Alike<typeof result1, Expected1>>,
  Expect<Alike<typeof result2, Expected2>>,
  Expect<Alike<typeof result3, Expected3>>,
]

type Expected1 = {
  foo: number
  bar: {
    value: string
  }
  name: string
}

type Expected2 = {
  name: string
}

type Expected3 = {
  name: number
}


// implement CheckRepeatedTuple
type CheckRepeatedTuple<List extends unknown[], Found = never> =
  List extends [infer First, ...infer Rest extends unknown[]]
    ? First extends Found
      ? true
      : CheckRepeatedTuple<Rest, Found | First>
    : false

export type CheckRepeatedTupleCases = [
  Expect<Equal<CheckRepeatedTuple<[number, number, string, boolean]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[number, string]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 3]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 1]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[]>, false>>,
  Expect<Equal<CheckRepeatedTuple<string[]>, false>>,
]

// implement Chunk

// increment and decrement list representation of a number
type ListNum = unknown[];
type Inc<CountList extends ListNum> = [...CountList, 1];
type Dec<CountList extends ListNum> = CountList extends [infer First, ...infer CountList]
  ? CountList
  : []
// convert CountList to string representation of a number
type N<CountList extends ListNum> = `${CountList['length']}`;
// convert number or string to CountList
type L<Num extends string | number, Accum extends ListNum = []> = {length: `${Accum['length']}`} extends {length: `${Num}`}
  ? Accum
  : L<Num, [...Accum, 1]>;

export type GetL1 = L<'4'>
export type GetL2 = L<4>
export type GetLDec = N<Inc<GetL1>>
export type TestDec = Dec<[1,1,1]>['length']

type Pop<List extends unknown[], CountList extends ListNum> =
  CountList['length'] extends 0
    ? List
    : List extends [infer _First, ...infer Rest]
      ? Pop<Rest, Dec<CountList>>
      : List

export type TestPop1 = Pop<[1,2,3,4], L<2>>
export type TestPop2 = Pop<[1], L<2>>

// List = [3]
// ChunkLen = 2
// ChunkedList = [1,2]
// Ret [1,2]
type GetChunk<List extends unknown[], ChunkLen extends number, ChunkedList extends unknown[] = []> =
   `${ChunkedList['length']}` extends `${ChunkLen}`
      ? ChunkedList
      : List extends [infer First, ...infer Rest]
        ? GetChunk<Rest, ChunkLen, [...ChunkedList, First]>
        : ChunkedList

export type GetChunkTest1 = GetChunk<[1,2,3,4,5], 3>
export type GetChunkTest2 = GetChunk<[1], 2>
export type GetChunkTest3 = GetChunk<[1,2,3,4,5], 2>

// List = [1,2,3]
// ChunkLen = 2
// ChunkedList = []
type Chunk<List extends unknown[], ChunkLen extends number, ChunkedList extends number[][] = []> =
  List extends []
    ? ChunkedList
    : Chunk<
        Pop<List, L<ChunkLen>>,
        ChunkLen, 
        [...ChunkedList, GetChunk<List, ChunkLen>]
      >

type ChunkTest1 = Chunk<[1, 2, 3], 2>;

type ChunkCases = [
  Expect<Equal<Chunk<[], 1>, []>>,
  Expect<Equal<Chunk<[1, 2, 3], 1>, [[1], [2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 5>, [[1, 2, 3, 4]]>>,
  Expect<Equal<Chunk<[1, true, 2, false], 2>, [[1, true], [2, false]]>>,
]
