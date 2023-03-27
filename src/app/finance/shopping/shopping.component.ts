import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { ReceiptArticle, UserSettings } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit {
  
  busy: boolean = false;
  articles: ReceiptArticle[] = [];
  cartitems: CartItem[] = [];
  usersettingsObj: UserSettings|null = null;

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) {
    this.userSettings.settings$.subscribe((settings) => {
      this.usersettingsObj = settings;
    });
    this.i18nService.setTitle('shopping.pagetitle');
  }

  article(id: number) : ReceiptArticle|null {
    let filter = this.articles.filter(a => a.id == id);
    if (filter.length === 1)
      return filter[0];
    return null;
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  f(date: Date|string, form: string): string {
    if (typeof date === 'string')
      date = new Date(date);
    return format(date, form, { locale: this.i18nService.DateLocale });
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.updateCart();
    this.updateArticles();
  }

  updateCart() : void {
    this.busy = true;
    let url: string = `${this.config.api.baseUrl}/fin/shopping/cart`;
    this.authService.queryApi(url).subscribe((reply) => {
      if (reply.success) {
        this.cartitems = <CartItem[]>reply.payload;
        console.log(this.cartitems);
        this.busy = false;
      }
      setTimeout(() => { this.updateCart(); }, 60000);
    });
  }

  updateArticles() : void {
    let url: string = `${this.config.api.baseUrl}/fin/articles`;
    this.authService.queryApi(url).subscribe((reply) => {
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
  removed: string|null;
  updated: string;
}
