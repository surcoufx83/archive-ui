import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { Subscription, first } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { I18nService } from 'src/app/i18n.service';
import { ReceiptArticle, UserSettings } from 'src/app/if';
import { L10nArchiveLocale } from 'src/app/l10n/l10n.types';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnDestroy, OnInit {

  articles: ReceiptArticle[] = [];
  busy: boolean = false;
  cartitems: CartItem[] = [];
  subscriptions: Subscription[] = [];
  usersettingsObj: UserSettings | null = null;

  constructor(
    private authService: AuthService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService
  ) {
    this.i18nService.setTitle('shopping.pagetitle');
  }

  article(id: number): ReceiptArticle | null {
    let filter = this.articles.filter(a => a.id == id);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  f(date: Date | string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  /**
   * Getter for i18n localization strings.
   * @returns The localization strings.
   */
  get i18nstr(): L10nArchiveLocale {
    return this.i18nService.str;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(this.userSettings.settings$.subscribe((settings) => this.usersettingsObj = settings));
    this.updateCart();
    this.updateArticles();
  }

  updateCart(): void {
    this.busy = true;
    let url: string = `${environment.api.baseUrl}/fin/shopping/cart`;
    this.authService.queryApi(url).pipe(first()).subscribe((reply) => {
      if (reply.success) {
        this.cartitems = <CartItem[]>reply.payload;
        console.log(this.cartitems);
        this.busy = false;
      }
      setTimeout(() => { this.updateCart(); }, 60000);
    });
  }

  updateArticles(): void {
    let url: string = `${environment.api.baseUrl}/fin/articles`;
    this.authService.queryApi(url).pipe(first()).subscribe((reply) => {
      if (reply.success) {
        this.articles = <ReceiptArticle[]>reply.payload;
      }
      setTimeout(() => { this.updateArticles(); }, 60000);
    });
  }

}

export interface CartItem {
  article: ReceiptArticle;
  articleid: number;
  created: string;
  id: number;
  notes: string;
  removed: string | null;
  updated: string;
}
