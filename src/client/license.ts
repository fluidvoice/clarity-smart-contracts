import { Client, Provider, Receipt, Result } from "@blockstack/clarity";

export class LicenseClient extends Client {
  constructor(provider: Provider) {
    super("license", "license/license", provider);
  }

  async getAmount(params: { principal: string }): Promise<Receipt> {
    const query = this.createQuery({
      method: { name: "get-price", args: [`${type}`] },
    });
    const res = await this.submitQuery(query);
    const someString = Result.unwrap(res);
    return parseInt(someString.substr(6, someString.length - 7));
  }

  async buyNonExpiring(params: { sender: string }): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy-non-expiring", args: [] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    this.provider.mineBlock(10);
    return res;
  }

  async buyExpiring(
    duration: number,
    params: { sender: string }
  ): Promise<Receipt> {
    const tx = this.createTransaction({
      method: { name: "buy-expiring", args: [`${duration}`] },
    });
    await tx.sign(params.sender);
    const res = await this.submitTransaction(tx);
    console.log({ res });
    return res;
  }

  async getPrice(type: number): Promise<number> {
    const query = this.createQuery({
      method: { name: "get-price", args: [`${type}`] },
    });
    const res = await this.submitQuery(query);
    const someString = Result.unwrap(res);
    return parseInt(someString.substr(6, someString.length - 7));
  }

  async getBlockHeight(): Promise<number> {
    const query = this.createQuery({
      method: { name: "get-block-height", args: [] },
    });
    const res = await this.submitQuery(query);
    return parseInt(Result.unwrap(res));
  }

  async getLicense(licensee: string): Promise<string> {
    const query = this.createQuery({
      method: { name: "get-license", args: [`'${licensee}`] },
    });
    const res = await this.submitQuery(query);
    return Result.unwrap(res);
  }

  async hasValidLicense(licensee: string): Promise<boolean> {
    const query = this.createQuery({
      method: { name: "has-valid-license", args: [`'${licensee}`] },
    });
    const res = await this.submitQuery(query);
    if (res.success) {
      return Result.unwrap(res) === "true";
    } else {
      return false;
    }
  }
}
