// D4: the e-commerce checkout that plays inside the kit Window. One flow, four beats:
// shop + cart (375) -> address (390) -> payment (405) -> done (420). Everything is built from kit components.
import React from "react";
import { prog } from "../../../lib/anim";
import {
  Badge, Btn, Card, Checkbox, Field, flex, Icon, IconTile, Progress, ProductCard, Row, Tabs, Window, windowInner,
} from "../../kit/ui";
import { P } from "../../tokens";
import { body, head, label, numeral } from "../../type";
import { tri } from "./common";

export const WIN = { x: 960, y: 148, w: 900, h: 560 };
/** frames (scene-local) where the checkout moves on; same as the stepper chips */
export const BEATS = { cart: 15, address: 30, pay: 45, done: 60 };

const tx = (size: number, wght: number, color: string): React.CSSProperties => ({ ...body(size, wght), color, whiteSpace: "nowrap", lineHeight: 1.1 });

/** A panel that snaps in from the right when its state starts. */
const Panel: React.FC<{ f: number; at: number; x: number; y: number; children: React.ReactNode }> = ({ f, at, x, y, children }) => {
  const t = prog(f, at, at + 5);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${(1 - t) * 70}px)`, opacity: t > 0.02 ? 1 : 0 }}>{children}</div>;
};

const CartPanel: React.FC<{ f: number }> = ({ f }) => {
  const filled = f >= BEATS.cart;
  const paid = f >= BEATS.done;
  const t = prog(f, BEATS.cart, BEATS.cart + 6);
  return (
    <Card x={604} y={84} w={262} h={372} pad={16} shadow={P.orangeDeep}>
      <div style={flex("row", { justifyContent: "space-between", height: 32 })}>
        <span style={{ ...label(20, 700), color: paid ? P.orange : P.dim }}>{paid ? "Paid" : "Your cart"}</span>
        {filled && <Badge label="1" tone="orange" style={{ transform: `scale(${Math.min(1.15, t * 1.4)})` }} />}
      </div>
      {!filled ? (
        <div style={flex("column", { alignItems: "center", justifyContent: "center", flex: 1, gap: 14 })}>
          <Icon name="cart" size={64} color={P.faint} />
          <span style={tx(22, 560, P.dim)}>Nothing yet</span>
        </div>
      ) : (
        <>
          <div style={{ ...flex("row", { gap: 12 }), transform: `translateX(${(1 - t) * 40}px)` }}>
            <IconTile name="box" size={46} tone="yellow" />
            <div style={flex("column", { gap: 4 })}>
              <span style={tx(22, 720, P.paper)}>Headphones</span>
              <span style={tx(20, 520, P.dim)}>Qty 1</span>
            </div>
          </div>
          <div style={{ height: 3, background: P.line, margin: "8px 0" }} />
          <div style={flex("row", { justifyContent: "space-between" })}>
            <span style={tx(22, 560, P.dim)}>Subtotal</span>
            <span style={tx(22, 700, P.paper)}>$129</span>
          </div>
          <div style={flex("row", { justifyContent: "space-between" })}>
            <span style={tx(22, 560, P.dim)}>Shipping</span>
            <span style={tx(22, 700, P.orange)}>Free</span>
          </div>
          <div style={{ ...flex("row", { justifyContent: "space-between", alignItems: "flex-end" }), marginTop: "auto" }}>
            <span style={{ ...label(20, 640), color: P.dim, paddingBottom: 6 }}>Total</span>
            <span style={{ ...numeral(52, 92, 780), color: P.paper }}>$129</span>
          </div>
          <Btn label={paid ? "Track order" : "Checkout"} icon={paid ? "pin" : "arrow"} iconRight={!paid} w={224} variant={paid ? "yellow" : "primary"} style={{ marginTop: 8 }} />
        </>
      )}
    </Card>
  );
};

const ShopGrid: React.FC<{ f: number }> = ({ f }) => (
  <>
    <ProductCard x={28} y={84} w={268} pressed={tri(f, 11, 3, 4)} shadow={P.orangeDeep} />
    <span style={{ ...label(20, 700), color: P.dim, position: "absolute", left: 316, top: 86 }}>Often added</span>
    <Row x={316} y={120} w={268} icon="box" title="Travel case" sub="$24" right="Add" tone="yellow" />
    <Row x={316} y={208} w={268} icon="bolt" title="USB-C cable" sub="$12" right="Add" tone="cream" />
    <Row x={316} y={296} w={268} icon="tag" title="Ear cushions" sub="$18" right="Add" tone="orange" />
    <Progress x={316} y={396} w={268} value={prog(f, 4, 14) * 0.76} label="Free shipping" />
  </>
);

const AddressForm: React.FC<{ f: number }> = ({ f }) => {
  const a = BEATS.address;
  const ty = (s: number, e: number) => prog(f, a + s, a + e, (x) => x);
  const foc = (s: number, e: number) => f >= a + s && f < a + e;
  return (
    <Card x={28} y={84} w={556} h={372} pad={20} shadow={P.orangeDeep}>
      <div style={flex("column", { gap: 18 })}>
        <Field label="Full name" value="Riya Sen" w={516} typed={ty(2, 9)} focused={foc(2, 10)} />
        <Field label="Street address" value="12 Park Street" w={516} typed={ty(5, 12)} focused={foc(5, 13)} icon="pin" />
        <div style={flex("row", { gap: 16 })}>
          <Field label="City" value="Kolkata" w={250} typed={ty(8, 13)} focused={foc(8, 14)} />
          <Field label="PIN" value="700016" w={250} typed={ty(10, 14)} focused={foc(10, 15)} />
        </div>
      </div>
    </Card>
  );
};

const PayForm: React.FC<{ f: number }> = ({ f }) => {
  const a = BEATS.pay;
  const ty = (s: number, e: number) => prog(f, a + s, a + e, (x) => x);
  const foc = (s: number, e: number) => f >= a + s && f < a + e;
  return (
    <Card x={28} y={84} w={556} h={372} pad={20} shadow={P.orangeDeep}>
      <div style={flex("column", { gap: 16 })}>
        <Field label="Card number" value="4242 4242 4242 4242" w={516} typed={ty(1, 9)} focused={foc(1, 10)} icon="card" />
        <div style={flex("row", { gap: 16 })}>
          <Field label="Expiry" value="08 / 28" w={250} typed={ty(5, 10)} focused={foc(5, 11)} />
          <Field label="CVC" value="123" w={250} typed={ty(8, 11)} focused={foc(8, 12)} />
        </div>
        <Checkbox label="Save card for next time" checked={prog(f, a + 10, a + 13)} />
        <Btn label="Pay $129" icon="check" w={516} pressed={tri(f, a + 11, 2, 2)} />
      </div>
    </Card>
  );
};

const DoneCard: React.FC<{ f: number }> = ({ f }) => (
  <Card x={28} y={84} w={556} h={372} tone="orange" pad={28} shadow={P.orangeDeep}>
    <div style={flex("row", { gap: 28, height: "100%" })}>
      <div style={{ width: 156, height: 156, borderRadius: 156, background: P.void, flex: "none", ...flex("row", { justifyContent: "center" }) }}>
        <Icon name="check" size={96} color={P.orange} stroke={9} draw={prog(f, BEATS.done + 2, BEATS.done + 12)} />
      </div>
      <div style={flex("column", { gap: 12 })}>
        <span style={{ ...head(66, 84, 800), color: P.void, whiteSpace: "nowrap" }}>Order</span>
        <span style={{ ...head(66, 84, 800), color: P.void, whiteSpace: "nowrap" }}>placed</span>
        <span style={{ ...tx(26, 640, P.void), marginTop: 6 }}>Arrives in 3 days</span>
      </div>
    </div>
  </Card>
);

/** The window with the whole flow inside it. */
export const ShopWindow: React.FC<{ f: number }> = ({ f }) => {
  const inner = windowInner(WIN.w, WIN.h);
  const s1 = f >= BEATS.address;
  const s2 = f >= BEATS.pay;
  const s3 = f >= BEATS.done;
  const doneT = prog(f, BEATS.done, BEATS.done + 5);
  return (
    <Window x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} url="shop.maison.co/headphones" shadow={P.orangeDeep}>
      <div style={{ position: "absolute", left: 0, top: 0, width: inner.w, height: inner.h }}>
        <div style={{ ...head(40, 90, 800), position: "absolute", left: 28, top: 14, color: P.paper, whiteSpace: "nowrap" }}>
          maison<span style={{ color: P.orange }}>.</span>
        </div>
        <Tabs x={300} y={4} w={300} items={["Audio", "Home", "Gifts"]} index={0} />
        <Icon name="cart" size={34} color={P.paper} style={{ position: "absolute", left: 828, top: 14 }} />
        {!s1 && <ShopGrid f={f} />}
        {s1 && !s2 && <Panel f={f} at={BEATS.address} x={0} y={0}><AddressForm f={f} /></Panel>}
        {s2 && !s3 && <Panel f={f} at={BEATS.pay} x={0} y={0}><PayForm f={f} /></Panel>}
        {s3 && <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${0.94 + 0.06 * doneT})`, transformOrigin: "300px 270px" }}><DoneCard f={f} /></div>}
        <CartPanel f={f} />
      </div>
    </Window>
  );
};
