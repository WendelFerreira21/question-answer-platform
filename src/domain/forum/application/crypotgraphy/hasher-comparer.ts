export abstract class HasherComparer {
  abstract compare(payload: string, hashed: string): Promise<boolean>
}