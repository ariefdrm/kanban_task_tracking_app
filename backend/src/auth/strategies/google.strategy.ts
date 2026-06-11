import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { googleOAuthConstants } from '../contants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: googleOAuthConstants.clientId,
      clientSecret: googleOAuthConstants.clientSecret,
      callbackURL: googleOAuthConstants.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  // Resolves the local user for the Google profile. The returned value becomes
  // `req.user` in the callback route.
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      done(new Error('Google account did not provide an email address'), undefined);
      return;
    }

    const user = await this.authService.validateGoogleUser({
      googleId: profile.id,
      email,
      name: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });

    done(null, user);
  }
}
